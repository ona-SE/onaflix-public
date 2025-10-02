import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../app';
import { pool } from '../config/database';
import { redis } from '../config/redis';

describe('API Integration Tests', () => {
  let app: Express;

  beforeAll(async () => {
    app = createApp();
    try {
      await redis.connect();
    } catch (error) {
      console.log('Redis not available for tests');
    }
  });

  afterAll(async () => {
    await pool.end();
    if (redis.status === 'ready') {
      await redis.quit();
    }
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('database');
      expect(response.body).toHaveProperty('cache');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api/movies', () => {
    it('should return array of movies', async () => {
      const response = await request(app).get('/api/movies');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/search', () => {
    it('should return search results with pagination', async () => {
      const response = await request(app).get('/api/search').query({ q: 'test' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('results');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.results)).toBe(true);
    });

    it('should validate query parameters', async () => {
      const response = await request(app).get('/api/search').query({ yearMin: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should apply filters correctly', async () => {
      const response = await request(app)
        .get('/api/search')
        .query({ ratingMin: 8, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.pagination.limit).toBe(10);
    });
  });

  describe('GET /api/suggestions', () => {
    it('should return empty array for short queries', async () => {
      const response = await request(app).get('/api/suggestions').query({ q: 'a' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return suggestions for valid queries', async () => {
      const response = await request(app).get('/api/suggestions').query({ q: 'act' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/movies/seed', () => {
    it('should seed the database', async () => {
      const response = await request(app).post('/api/movies/seed');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/unknown');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});
