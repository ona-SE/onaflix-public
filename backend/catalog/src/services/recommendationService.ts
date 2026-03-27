import { Movie } from '../types/movie.types';
import { MovieRepository } from '../repositories/movieRepository';
import { CacheService } from './cacheService';

interface ScoredMovie {
  movie: Movie;
  score: number;
  reasons: string[];
}

interface RecommendationOptions {
  limit?: number;
  excludeIds?: number[];
  minRating?: number;
}

/**
 * Recommendation engine for ona-flix.
 * Uses genre overlap, director affinity, rating proximity, and era matching
 * to score and rank movie suggestions.
 */
export class RecommendationService {
  private readonly CACHE_TTL = 600; // 10 minutes

  constructor(
    private movieRepository: MovieRepository,
    private cacheService: CacheService
  ) {}

  /**
   * Get movies similar to a given movie based on shared genres,
   * same director, similar rating, and release era.
   */
  async getSimilarMovies(
    movieId: number,
    options: RecommendationOptions = {}
  ): Promise<ScoredMovie[]> {
    const { limit = 5, excludeIds = [], minRating = 0 } = options;

    const cacheKey = `recommendations:similar:${movieId}:${limit}`;
    const cached = await this.cacheService.get<ScoredMovie[]>(cacheKey);
    if (cached) return cached;

    const allMovies = await this.movieRepository.findAll();
    const sourceMovie = allMovies.find(m => m.id === movieId);

    if (!sourceMovie) return [];

    const candidates = allMovies.filter(
      m =>
        m.id !== movieId &&
        !excludeIds.includes(m.id) &&
        (m.rating ?? 0) >= minRating
    );

    const scored = candidates
      .map(candidate => this.scoreMovieSimilarity(sourceMovie, candidate))
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    await this.cacheService.set(cacheKey, scored, this.CACHE_TTL);
    return scored;
  }

  /**
   * Get trending movies — highest rated recent releases.
   * "Recent" = last 5 years. Weighted by rating and recency.
   */
  async getTrendingMovies(limit: number = 10): Promise<ScoredMovie[]> {
    const cacheKey = `recommendations:trending:${limit}`;
    const cached = await this.cacheService.get<ScoredMovie[]>(cacheKey);
    if (cached) return cached;

    const allMovies = await this.movieRepository.findAll();
    const currentYear = new Date().getFullYear();
    const cutoffYear = currentYear - 5;

    const recentMovies = allMovies.filter(
      m => (m.release_year ?? 0) >= cutoffYear
    );

    const scored = recentMovies
      .map(movie => {
        const ratingScore = (movie.rating ?? 0) / 10;
        const recencyScore =
          ((movie.release_year ?? cutoffYear) - cutoffYear) / 5;
        const totalScore = ratingScore * 0.7 + recencyScore * 0.3;

        return {
          movie,
          score: Math.round(totalScore * 100) / 100,
          reasons: this.buildTrendingReasons(movie, currentYear),
        };
      })
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    await this.cacheService.set(cacheKey, scored, this.CACHE_TTL);
    return scored;
  }

  /**
   * Build a personalized feed based on a list of previously watched movie IDs.
   * Aggregates genre preferences and director affinity from watch history,
   * then scores unwatched movies against those preferences.
   */
  async getPersonalizedFeed(
    watchedMovieIds: number[],
    limit: number = 10
  ): Promise<ScoredMovie[]> {
    if (watchedMovieIds.length === 0) {
      return this.getTrendingMovies(limit);
    }

    const allMovies = await this.movieRepository.findAll();
    const watchedMovies = allMovies.filter(m =>
      watchedMovieIds.includes(m.id)
    );
    const unwatchedMovies = allMovies.filter(
      m => !watchedMovieIds.includes(m.id)
    );

    // Build preference profile from watch history
    const genreCounts = new Map<string, number>();
    const directorCounts = new Map<string, number>();
    let avgRating = 0;

    for (const movie of watchedMovies) {
      if (movie.genres) {
        for (const genre of movie.genres) {
          genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1);
        }
      }
      if (movie.director) {
        directorCounts.set(
          movie.director,
          (directorCounts.get(movie.director) ?? 0) + 1
        );
      }
      avgRating += movie.rating ?? 0;
    }
    avgRating = watchedMovies.length > 0 ? avgRating / watchedMovies.length : 5;

    const totalGenreHits = Array.from(genreCounts.values()).reduce(
      (a, b) => a + b,
      0
    );

    const scored = unwatchedMovies
      .map(movie => {
        let score = 0;
        const reasons: string[] = [];

        // Genre affinity (0-0.5)
        if (movie.genres) {
          let genreScore = 0;
          for (const genre of movie.genres) {
            const count = genreCounts.get(genre) ?? 0;
            genreScore += count / (totalGenreHits || 1);
          }
          genreScore = Math.min(genreScore, 0.5);
          if (genreScore > 0.1) {
            score += genreScore;
            reasons.push('Matches your genre preferences');
          }
        }

        // Director affinity (0-0.3)
        if (movie.director && directorCounts.has(movie.director)) {
          const dirScore =
            Math.min((directorCounts.get(movie.director) ?? 0) / 3, 1) * 0.3;
          score += dirScore;
          reasons.push(`You've watched other ${movie.director} films`);
        }

        // Rating proximity (0-0.2)
        const ratingDiff = Math.abs((movie.rating ?? 0) - avgRating);
        const ratingScore = Math.max(0, (5 - ratingDiff) / 5) * 0.2;
        score += ratingScore;

        return {
          movie,
          score: Math.round(score * 100) / 100,
          reasons,
        };
      })
      .filter(s => s.score > 0.05)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scored;
  }

  /**
   * Get top-rated movies across all time, optionally filtered by genre.
   */
  async getTopRated(
    genre?: string,
    limit: number = 10
  ): Promise<ScoredMovie[]> {
    const cacheKey = `recommendations:top:${genre ?? 'all'}:${limit}`;
    const cached = await this.cacheService.get<ScoredMovie[]>(cacheKey);
    if (cached) return cached;

    const allMovies = await this.movieRepository.findAll();

    let filtered = allMovies;
    if (genre) {
      filtered = allMovies.filter(
        m => m.genres && m.genres.includes(genre)
      );
    }

    const scored = filtered
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, limit)
      .map(movie => ({
        movie,
        score: (movie.rating ?? 0) / 10,
        reasons: [`Rated ${movie.rating}/10`],
      }));

    await this.cacheService.set(cacheKey, scored, this.CACHE_TTL);
    return scored;
  }

  // --- Private scoring helpers ---

  private scoreMovieSimilarity(
    source: Movie,
    candidate: Movie
  ): ScoredMovie {
    let score = 0;
    const reasons: string[] = [];

    // Genre overlap (0-0.4)
    if (source.genres && candidate.genres) {
      const overlap = source.genres.filter(g =>
        candidate.genres!.includes(g)
      ).length;
      const genreScore =
        (overlap / Math.max(source.genres.length, 1)) * 0.4;
      if (genreScore > 0) {
        score += genreScore;
        reasons.push(
          `Shares ${overlap} genre${overlap > 1 ? 's' : ''}`
        );
      }
    }

    // Same director (0.25)
    if (
      source.director &&
      candidate.director &&
      source.director === candidate.director
    ) {
      score += 0.25;
      reasons.push(`Same director: ${source.director}`);
    }

    // Rating proximity (0-0.2)
    const ratingDiff = Math.abs(
      (source.rating ?? 0) - (candidate.rating ?? 0)
    );
    const ratingScore = Math.max(0, (3 - ratingDiff) / 3) * 0.2;
    score += ratingScore;

    // Era match — within 10 years (0-0.15)
    const yearDiff = Math.abs(
      (source.release_year ?? 2000) - (candidate.release_year ?? 2000)
    );
    if (yearDiff <= 10) {
      const eraScore = ((10 - yearDiff) / 10) * 0.15;
      score += eraScore;
      reasons.push('Similar era');
    }

    return {
      movie: candidate,
      score: Math.round(score * 100) / 100,
      reasons,
    };
  }

  private buildTrendingReasons(movie: Movie, currentYear: number): string[] {
    const reasons: string[] = [];

    if ((movie.rating ?? 0) >= 8) {
      reasons.push('Highly rated');
    }
    if (movie.release_year === currentYear) {
      reasons.push('Released this year');
    } else if (movie.release_year === currentYear - 1) {
      reasons.push('Released last year');
    }
    if (movie.genres && movie.genres.length > 0) {
      reasons.push(`${movie.genres[0]} film`);
    }

    return reasons;
  }
}
