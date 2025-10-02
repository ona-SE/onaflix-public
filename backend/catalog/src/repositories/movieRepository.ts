import { Pool, QueryResult } from 'pg';
import { Movie, MovieSearchFilters, Suggestion } from '../types/movie.types';
import { logger } from '../config/logger';

export class MovieRepository {
  constructor(private pool: Pool) {}

  async findAll(): Promise<Movie[]> {
    const startTime = Date.now();
    try {
      const query = 'SELECT * FROM movies ORDER BY rating DESC';
      const result: QueryResult<Movie> = await this.pool.query(query);
      
      const duration = Date.now() - startTime;
      logger.debug('findAll query executed', { duration, count: result.rows.length });
      
      return result.rows;
    } catch (error) {
      logger.error('Error in findAll', { error });
      throw error;
    }
  }

  async search(filters: MovieSearchFilters): Promise<{ movies: Movie[]; total: number }> {
    const startTime = Date.now();
    try {
      const { query, params } = this.buildSearchQuery(filters);
      const countQuery = this.buildCountQuery(filters);

      const [moviesResult, countResult] = await Promise.all([
        this.pool.query<Movie>(query, params),
        this.pool.query<{ count: string }>(countQuery.query, countQuery.params),
      ]);

      const duration = Date.now() - startTime;
      logger.debug('search query executed', { 
        duration, 
        count: moviesResult.rows.length,
        total: countResult.rows[0].count,
        filters 
      });

      return {
        movies: moviesResult.rows,
        total: parseInt(countResult.rows[0].count),
      };
    } catch (error) {
      logger.error('Error in search', { error, filters });
      throw error;
    }
  }

  async getSuggestions(searchTerm: string): Promise<Suggestion[]> {
    const startTime = Date.now();
    try {
      const query = `
        SELECT DISTINCT suggestion, type, COUNT(*) as frequency
        FROM (
          SELECT title as suggestion, 'title' as type FROM movies 
          WHERE title ILIKE $1
          UNION ALL
          SELECT director as suggestion, 'director' as type FROM movies 
          WHERE director ILIKE $1 AND director IS NOT NULL
          UNION ALL
          SELECT unnest(movie_cast) as suggestion, 'actor' as type FROM movies 
          WHERE movie_cast IS NOT NULL AND EXISTS (
            SELECT 1 FROM unnest(movie_cast) as actor WHERE actor ILIKE $1
          )
          UNION ALL
          SELECT unnest(genres) as suggestion, 'genre' as type FROM movies 
          WHERE genres IS NOT NULL AND EXISTS (
            SELECT 1 FROM unnest(genres) as genre WHERE genre ILIKE $1
          )
        ) suggestions
        GROUP BY suggestion, type
        ORDER BY frequency DESC, suggestion ASC
        LIMIT 10
      `;

      const result = await this.pool.query(query, [`%${searchTerm}%`]);
      
      const duration = Date.now() - startTime;
      logger.debug('getSuggestions query executed', { duration, count: result.rows.length });

      return result.rows.map(row => ({
        text: row.suggestion,
        type: row.type,
        frequency: parseInt(row.frequency),
      }));
    } catch (error) {
      logger.error('Error in getSuggestions', { error, searchTerm });
      throw error;
    }
  }

  async truncate(): Promise<void> {
    try {
      await this.pool.query('TRUNCATE TABLE movies');
      logger.info('Movies table truncated');
    } catch (error) {
      logger.error('Error truncating movies table', { error });
      throw error;
    }
  }

  async seed(): Promise<void> {
    try {
      await this.pool.query(`
        TRUNCATE TABLE movies;
        INSERT INTO movies (title, description, release_year, rating, image_url) VALUES
        ('The Shawshank Redemption', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 1994, 9.3, 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg'),
        ('The Godfather', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 1972, 9.2, 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg'),
        ('The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 2008, 9.0, 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg'),
        ('Pulp Fiction', 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', 1994, 8.9, 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg'),
        ('Fight Club', 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.', 1999, 8.8, 'https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg')
      `);
      logger.info('Movies table seeded');
    } catch (error) {
      logger.error('Error seeding movies table', { error });
      throw error;
    }
  }

  private buildSearchQuery(filters: MovieSearchFilters): { query: string; params: any[] } {
    let query = 'SELECT * FROM movies WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.q && filters.q.trim()) {
      query += ` AND (
        to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(director, '')) 
        @@ plainto_tsquery('english', $${paramIndex})
        OR title ILIKE $${paramIndex + 1}
        OR description ILIKE $${paramIndex + 1}
        OR director ILIKE $${paramIndex + 1}
      )`;
      params.push(filters.q.trim(), `%${filters.q.trim()}%`);
      paramIndex += 2;
    }

    if (filters.genres && filters.genres.length > 0) {
      query += ` AND genres && $${paramIndex}`;
      params.push(filters.genres);
      paramIndex++;
    }

    if (filters.yearMin !== undefined) {
      query += ` AND release_year >= $${paramIndex}`;
      params.push(filters.yearMin);
      paramIndex++;
    }

    if (filters.yearMax !== undefined) {
      query += ` AND release_year <= $${paramIndex}`;
      params.push(filters.yearMax);
      paramIndex++;
    }

    if (filters.ratingMin !== undefined) {
      query += ` AND rating >= $${paramIndex}`;
      params.push(filters.ratingMin);
      paramIndex++;
    }

    if (filters.ratingMax !== undefined) {
      query += ` AND rating <= $${paramIndex}`;
      params.push(filters.ratingMax);
      paramIndex++;
    }

    if (filters.durationMin !== undefined) {
      query += ` AND duration >= $${paramIndex}`;
      params.push(filters.durationMin);
      paramIndex++;
    }

    if (filters.durationMax !== undefined) {
      query += ` AND duration <= $${paramIndex}`;
      params.push(filters.durationMax);
      paramIndex++;
    }

    const searchTerm = filters.q?.trim();
    query += ` ORDER BY 
      CASE WHEN $1 IS NOT NULL THEN 
        ts_rank(to_tsvector('english', title || ' ' || COALESCE(description, '')), plainto_tsquery('english', $1))
      ELSE 0 END DESC,
      rating DESC, 
      release_year DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;

    params.push(filters.limit || 50, filters.offset || 0);

    return { query, params };
  }

  private buildCountQuery(filters: MovieSearchFilters): { query: string; params: any[] } {
    let query = 'SELECT COUNT(*) FROM movies WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.q && filters.q.trim()) {
      query += ` AND (
        to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(director, '')) 
        @@ plainto_tsquery('english', $${paramIndex})
        OR title ILIKE $${paramIndex + 1}
        OR description ILIKE $${paramIndex + 1}
        OR director ILIKE $${paramIndex + 1}
      )`;
      params.push(filters.q.trim(), `%${filters.q.trim()}%`);
      paramIndex += 2;
    }

    if (filters.genres && filters.genres.length > 0) {
      query += ` AND genres && $${paramIndex}`;
      params.push(filters.genres);
      paramIndex++;
    }

    if (filters.yearMin !== undefined) {
      query += ` AND release_year >= $${paramIndex}`;
      params.push(filters.yearMin);
      paramIndex++;
    }

    if (filters.yearMax !== undefined) {
      query += ` AND release_year <= $${paramIndex}`;
      params.push(filters.yearMax);
      paramIndex++;
    }

    if (filters.ratingMin !== undefined) {
      query += ` AND rating >= $${paramIndex}`;
      params.push(filters.ratingMin);
      paramIndex++;
    }

    if (filters.ratingMax !== undefined) {
      query += ` AND rating <= $${paramIndex}`;
      params.push(filters.ratingMax);
      paramIndex++;
    }

    if (filters.durationMin !== undefined) {
      query += ` AND duration >= $${paramIndex}`;
      params.push(filters.durationMin);
      paramIndex++;
    }

    if (filters.durationMax !== undefined) {
      query += ` AND duration <= $${paramIndex}`;
      params.push(filters.durationMax);
      paramIndex++;
    }

    return { query, params };
  }
}
