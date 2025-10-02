import { Redis } from 'ioredis';
import { logger } from '../config/logger';

export class CacheService {
  private readonly defaultTTL = 300;

  constructor(private redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.redis.status !== 'ready') {
        return null;
      }

      const startTime = Date.now();
      const data = await this.redis.get(key);
      const duration = Date.now() - startTime;

      if (data) {
        logger.debug('Cache hit', { key, duration });
        return JSON.parse(data) as T;
      }

      logger.debug('Cache miss', { key, duration });
      return null;
    } catch (error) {
      logger.warn('Cache get error', { key, error });
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = this.defaultTTL): Promise<void> {
    try {
      if (this.redis.status !== 'ready') {
        return;
      }

      const startTime = Date.now();
      await this.redis.setex(key, ttl, JSON.stringify(value));
      const duration = Date.now() - startTime;

      logger.debug('Cache set', { key, ttl, duration });
    } catch (error) {
      logger.warn('Cache set error', { key, error });
    }
  }

  async del(key: string): Promise<void> {
    try {
      if (this.redis.status !== 'ready') {
        return;
      }

      await this.redis.del(key);
      logger.debug('Cache deleted', { key });
    } catch (error) {
      logger.warn('Cache delete error', { key, error });
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      if (this.redis.status !== 'ready') {
        return;
      }

      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
        logger.debug('Cache pattern deleted', { pattern, count: keys.length });
      }
    } catch (error) {
      logger.warn('Cache pattern delete error', { pattern, error });
    }
  }

  async ping(): Promise<number> {
    try {
      if (this.redis.status !== 'ready') {
        return -1;
      }

      const startTime = Date.now();
      await this.redis.ping();
      return Date.now() - startTime;
    } catch (error) {
      logger.error('Cache ping error', { error });
      return -1;
    }
  }

  isAvailable(): boolean {
    return this.redis.status === 'ready';
  }
}
