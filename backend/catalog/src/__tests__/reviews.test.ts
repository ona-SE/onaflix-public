import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../app';
import { pool } from '../config/database';
import { redis } from '../config/redis';

describe('Review API', () => {
  let app: Express;
  let dbAvailable = false;
  let testMovieId: number;

  beforeAll(async () => {
    app = createApp();

    try {
      await pool.query('SELECT 1');
      dbAvailable = true;
    } catch (error) {
      console.log('Database not available - skipping review tests');
      return;
    }

    try {
      await redis.connect();
    } catch (error) {
      // Redis optional
    }

    // Ensure a test movie exists
    const result = await pool.query(
      `INSERT INTO movies (title, description, release_year, rating)
       VALUES ('Test Review Movie', 'A movie for testing reviews', 2024, 7.5)
       RETURNING id`
    );
    testMovieId = result.rows[0].id;
  });

  beforeEach(async () => {
    if (!dbAvailable) return;
    // Clean reviews between tests
    await pool.query('DELETE FROM reviews');
  });

  afterAll(async () => {
    if (dbAvailable) {
      await pool.query('DELETE FROM reviews');
      await pool.query('DELETE FROM movies WHERE title = $1', ['Test Review Movie']);
    }
    await pool.end();
    if (redis.status === 'ready') {
      await redis.quit();
    }
  });

  describe('POST /api/movies/:movieId/reviews', () => {
    it('should create a review with valid input', async () => {
      if (!dbAvailable) return;

      const response = await request(app)
        .post(`/api/movies/${testMovieId}/reviews`)
        .send({
          user_name: 'Jane Doe',
          rating: 4,
          text: 'A masterpiece of modern cinema that deserves recognition.',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.movie_id).toBe(testMovieId);
      expect(response.body.user_name).toBe('Jane Doe');
      expect(response.body.rating).toBe(4);
      expect(response.body.text).toBe('A masterpiece of modern cinema that deserves recognition.');
      expect(response.body).toHaveProperty('created_at');
    });

    it('should return 400 for missing fields', async () => {
      if (!dbAvailable) return;

      const response = await request(app)
        .post(`/api/movies/${testMovieId}/reviews`)
        .send({ user_name: 'Jane' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for rating out of range', async () => {
      if (!dbAvailable) return;

      const response = await request(app)
        .post(`/api/movies/${testMovieId}/reviews`)
        .send({
          user_name: 'Jane Doe',
          rating: 6,
          text: 'This rating is too high for the scale.',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for text too short', async () => {
      if (!dbAvailable) return;

      const response = await request(app)
        .post(`/api/movies/${testMovieId}/reviews`)
        .send({
          user_name: 'Jane Doe',
          rating: 3,
          text: 'Short',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for text too long', async () => {
      if (!dbAvailable) return;

      const response = await request(app)
        .post(`/api/movies/${testMovieId}/reviews`)
        .send({
          user_name: 'Jane Doe',
          rating: 3,
          text: 'x'.repeat(2001),
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent movie', async () => {
      if (!dbAvailable) return;

      const response = await request(app)
        .post('/api/movies/999999/reviews')
        .send({
          user_name: 'Jane Doe',
          rating: 4,
          text: 'This movie does not exist in the database.',
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/movies/:movieId/reviews', () => {
    it('should return paginated reviews', async () => {
      if (!dbAvailable) return;

      // Seed some reviews
      for (let i = 1; i <= 3; i++) {
        await pool.query(
          `INSERT INTO reviews (movie_id, user_name, rating, text)
           VALUES ($1, $2, $3, $4)`,
          [testMovieId, `User ${i}`, i, `This is review number ${i} with enough text.`]
        );
      }

      const response = await request(app)
        .get(`/api/movies/${testMovieId}/reviews`)
        .query({ limit: 2, offset: 0 });

      expect(response.status).toBe(200);
      expect(response.body.reviews).toHaveLength(2);
      expect(response.body.total).toBe(3);
      expect(response.body.limit).toBe(2);
      expect(response.body.offset).toBe(0);
    });

    it('should return empty array for movie with no reviews', async () => {
      if (!dbAvailable) return;

      const response = await request(app)
        .get(`/api/movies/${testMovieId}/reviews`);

      expect(response.status).toBe(200);
      expect(response.body.reviews).toEqual([]);
      expect(response.body.total).toBe(0);
    });

    it('should return 404 for non-existent movie', async () => {
      if (!dbAvailable) return;

      const response = await request(app)
        .get('/api/movies/999999/reviews');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/movies/:movieId/reviews/:reviewId', () => {
    it('should delete an existing review', async () => {
      if (!dbAvailable) return;

      const insertResult = await pool.query(
        `INSERT INTO reviews (movie_id, user_name, rating, text)
         VALUES ($1, 'Reviewer', 5, 'Great movie that I really enjoyed watching.')
         RETURNING id`,
        [testMovieId]
      );
      const reviewId = insertResult.rows[0].id;

      const response = await request(app)
        .delete(`/api/movies/${testMovieId}/reviews/${reviewId}`);

      expect(response.status).toBe(204);

      // Verify it's gone
      const check = await pool.query('SELECT id FROM reviews WHERE id = $1', [reviewId]);
      expect(check.rows).toHaveLength(0);
    });

    it('should return 404 for non-existent review', async () => {
      if (!dbAvailable) return;

      const response = await request(app)
        .delete(`/api/movies/${testMovieId}/reviews/999999`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/movies/:movieId/reviews/summary', () => {
    it('should return review summary stats', async () => {
      if (!dbAvailable) return;

      // Seed reviews with known ratings
      const ratings = [1, 2, 3, 3, 4, 4, 4, 5, 5, 5];
      for (let i = 0; i < ratings.length; i++) {
        await pool.query(
          `INSERT INTO reviews (movie_id, user_name, rating, text)
           VALUES ($1, $2, $3, $4)`,
          [testMovieId, `User ${i}`, ratings[i], `Review text number ${i} with enough characters.`]
        );
      }

      const response = await request(app)
        .get(`/api/movies/${testMovieId}/reviews/summary`);

      expect(response.status).toBe(200);
      expect(response.body.movie_id).toBe(testMovieId);
      expect(response.body.total_reviews).toBe(10);
      expect(response.body.average_rating).toBeCloseTo(3.6, 1);
      expect(response.body.rating_distribution).toEqual({
        '1': 1,
        '2': 1,
        '3': 2,
        '4': 3,
        '5': 3,
      });
    });

    it('should return zero summary for movie with no reviews', async () => {
      if (!dbAvailable) return;

      const response = await request(app)
        .get(`/api/movies/${testMovieId}/reviews/summary`);

      expect(response.status).toBe(200);
      expect(response.body.total_reviews).toBe(0);
      expect(response.body.average_rating).toBe(0);
    });

    it('should return 404 for non-existent movie', async () => {
      if (!dbAvailable) return;

      const response = await request(app)
        .get('/api/movies/999999/reviews/summary');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});
