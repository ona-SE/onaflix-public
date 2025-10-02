import Redis from 'ioredis';
import { logger } from './logger';

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: 3,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  lazyConnect: true,
};

export const redis = new Redis(redisConfig);

redis.on('connect', () => {
  logger.info('Redis connection established');
});

redis.on('error', (err) => {
  logger.error('Redis connection error', { error: err.message });
});

redis.on('close', () => {
  logger.warn('Redis connection closed');
});

redis.on('reconnecting', () => {
  logger.info('Redis reconnecting...');
});

export const connectRedis = async (): Promise<boolean> => {
  try {
    await redis.connect();
    await redis.ping();
    logger.info('Redis connection test successful');
    return true;
  } catch (error) {
    logger.warn('Redis connection failed, caching will be disabled', { error });
    return false;
  }
};

export const gracefulShutdown = async (): Promise<void> => {
  try {
    await redis.quit();
    logger.info('Redis connection closed gracefully');
  } catch (error) {
    logger.error('Error closing Redis connection', { error });
  }
};

export const isRedisAvailable = (): boolean => {
  return redis.status === 'ready';
};
