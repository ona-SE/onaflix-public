import { Pool, QueryResult } from 'pg';
import { Review, ReviewSummary } from '../types/review.types';
import { logger } from '../config/logger';

export class ReviewRepository {
  constructor(private pool: Pool) {}

  async create(movieId: number, userName: string, rating: number, text: string): Promise<Review> {
    const startTime = Date.now();
    try {
      const query = `
        INSERT INTO reviews (movie_id, user_name, rating, text)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const result: QueryResult<Review> = await this.pool.query(query, [movieId, userName, rating, text]);

      const duration = Date.now() - startTime;
      logger.debug('create review query executed', { duration, movieId });

      return result.rows[0];
    } catch (error) {
      logger.error('Error in create review', { error, movieId });
      throw error;
    }
  }

  async findByMovieId(movieId: number, limit: number, offset: number): Promise<{ reviews: Review[]; total: number }> {
    const startTime = Date.now();
    try {
      const reviewsQuery = `
        SELECT * FROM reviews
        WHERE movie_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `;
      const countQuery = `
        SELECT COUNT(*)::int as total FROM reviews WHERE movie_id = $1
      `;

      const [reviewsResult, countResult] = await Promise.all([
        this.pool.query<Review>(reviewsQuery, [movieId, limit, offset]),
        this.pool.query<{ total: number }>(countQuery, [movieId]),
      ]);

      const duration = Date.now() - startTime;
      logger.debug('findByMovieId query executed', { duration, movieId, count: reviewsResult.rows.length });

      return {
        reviews: reviewsResult.rows,
        total: countResult.rows[0].total,
      };
    } catch (error) {
      logger.error('Error in findByMovieId', { error, movieId });
      throw error;
    }
  }

  async findById(reviewId: number): Promise<Review | null> {
    const startTime = Date.now();
    try {
      const query = 'SELECT * FROM reviews WHERE id = $1';
      const result: QueryResult<Review> = await this.pool.query(query, [reviewId]);

      const duration = Date.now() - startTime;
      logger.debug('findById query executed', { duration, reviewId });

      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error in findById', { error, reviewId });
      throw error;
    }
  }

  async deleteById(reviewId: number): Promise<number> {
    const startTime = Date.now();
    try {
      const query = 'DELETE FROM reviews WHERE id = $1';
      const result = await this.pool.query(query, [reviewId]);

      const duration = Date.now() - startTime;
      logger.debug('deleteById query executed', { duration, reviewId });

      return result.rowCount ?? 0;
    } catch (error) {
      logger.error('Error in deleteById', { error, reviewId });
      throw error;
    }
  }

  async getSummary(movieId: number): Promise<ReviewSummary> {
    const startTime = Date.now();
    try {
      const query = `
        SELECT
          COALESCE(AVG(rating), 0) as average_rating,
          COUNT(*)::int as total_reviews,
          COUNT(*) FILTER (WHERE rating = 1)::int as r1,
          COUNT(*) FILTER (WHERE rating = 2)::int as r2,
          COUNT(*) FILTER (WHERE rating = 3)::int as r3,
          COUNT(*) FILTER (WHERE rating = 4)::int as r4,
          COUNT(*) FILTER (WHERE rating = 5)::int as r5
        FROM reviews
        WHERE movie_id = $1
      `;
      const result = await this.pool.query(query, [movieId]);
      const row = result.rows[0];

      const duration = Date.now() - startTime;
      logger.debug('getSummary query executed', { duration, movieId });

      return {
        movie_id: movieId,
        average_rating: parseFloat(parseFloat(row.average_rating).toFixed(1)),
        total_reviews: row.total_reviews,
        rating_distribution: {
          '1': row.r1,
          '2': row.r2,
          '3': row.r3,
          '4': row.r4,
          '5': row.r5,
        },
      };
    } catch (error) {
      logger.error('Error in getSummary', { error, movieId });
      throw error;
    }
  }
}
