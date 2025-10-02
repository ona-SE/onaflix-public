import { MovieRepository } from '../repositories/movieRepository';
import { CacheService } from './cacheService';
import { Movie, MovieSearchFilters, SearchResult, Suggestion } from '../types/movie.types';
import { logger } from '../config/logger';

export class MovieService {
  private readonly CACHE_TTL = {
    ALL_MOVIES: 300,
    SEARCH: 180,
    SUGGESTIONS: 120,
  };

  constructor(
    private movieRepository: MovieRepository,
    private cacheService: CacheService
  ) {}

  async getAllMovies(): Promise<Movie[]> {
    const cacheKey = 'movies:all';

    const cached = await this.cacheService.get<Movie[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const movies = await this.movieRepository.findAll();
    await this.cacheService.set(cacheKey, movies, this.CACHE_TTL.ALL_MOVIES);

    return movies;
  }

  async searchMovies(filters: MovieSearchFilters): Promise<SearchResult> {
    const cacheKey = this.buildSearchCacheKey(filters);

    const cached = await this.cacheService.get<SearchResult>(cacheKey);
    if (cached) {
      return cached;
    }

    const parsedFilters = this.parseSearchFilters(filters);
    const { movies, total } = await this.movieRepository.search(parsedFilters);

    const result: SearchResult = {
      results: movies,
      pagination: {
        total,
        limit: parsedFilters.limit || 50,
        offset: parsedFilters.offset || 0,
        hasMore: (parsedFilters.offset || 0) + (parsedFilters.limit || 50) < total,
      },
    };

    await this.cacheService.set(cacheKey, result, this.CACHE_TTL.SEARCH);

    return result;
  }

  async getSuggestions(searchTerm: string): Promise<Suggestion[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return [];
    }

    const cacheKey = `suggestions:${searchTerm.toLowerCase().trim()}`;

    const cached = await this.cacheService.get<Suggestion[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const suggestions = await this.movieRepository.getSuggestions(searchTerm);
    await this.cacheService.set(cacheKey, suggestions, this.CACHE_TTL.SUGGESTIONS);

    return suggestions;
  }

  async seedDatabase(): Promise<void> {
    await this.movieRepository.seed();
    await this.invalidateAllCaches();
    logger.info('Database seeded and caches invalidated');
  }

  async clearDatabase(): Promise<void> {
    await this.movieRepository.truncate();
    await this.invalidateAllCaches();
    logger.info('Database cleared and caches invalidated');
  }

  private async invalidateAllCaches(): Promise<void> {
    await Promise.all([
      this.cacheService.delPattern('movies:*'),
      this.cacheService.delPattern('search:*'),
      this.cacheService.delPattern('suggestions:*'),
    ]);
  }

  private parseSearchFilters(filters: MovieSearchFilters): MovieSearchFilters {
    const parsed: MovieSearchFilters = {
      ...filters,
      limit: filters.limit || 50,
      offset: filters.offset || 0,
    };

    if (filters.genres && typeof filters.genres === 'string') {
      parsed.genres = (filters.genres as string)
        .split(',')
        .map(g => g.trim())
        .filter(g => g);
    }

    return parsed;
  }

  private buildSearchCacheKey(filters: MovieSearchFilters): string {
    const parts = ['search'];
    
    if (filters.q) parts.push(`q:${filters.q}`);
    if (filters.genres) parts.push(`g:${filters.genres}`);
    if (filters.yearMin) parts.push(`ym:${filters.yearMin}`);
    if (filters.yearMax) parts.push(`yM:${filters.yearMax}`);
    if (filters.ratingMin) parts.push(`rm:${filters.ratingMin}`);
    if (filters.ratingMax) parts.push(`rM:${filters.ratingMax}`);
    if (filters.durationMin) parts.push(`dm:${filters.durationMin}`);
    if (filters.durationMax) parts.push(`dM:${filters.durationMax}`);
    parts.push(`l:${filters.limit || 50}`);
    parts.push(`o:${filters.offset || 0}`);

    return parts.join(':');
  }
}
