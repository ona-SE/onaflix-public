import dotenv from 'dotenv';
import { createApp } from './app';
import { testConnection, gracefulShutdown as shutdownDatabase } from './config/database';
import { connectRedis, gracefulShutdown as shutdownRedis } from './config/redis';
import { logger } from './config/logger';

dotenv.config();

const port = process.env.PORT || 3001;

const startServer = async () => {
  try {
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.error('Failed to connect to database');
      process.exit(1);
    }

    const redisConnected = await connectRedis();
    if (!redisConnected) {
      logger.warn('Redis connection failed, continuing without cache');
    }

    const app = createApp();

    const server = app.listen(port, () => {
      logger.info(`Catalog service running on port ${port}`, {
        port,
        nodeEnv: process.env.NODE_ENV,
        database: 'connected',
        cache: redisConnected ? 'connected' : 'disabled',
      });
    });

    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received, starting graceful shutdown`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await Promise.all([shutdownDatabase(), shutdownRedis()]);
          logger.info('All connections closed gracefully');
          process.exit(0);
        } catch (error) {
          logger.error('Error during graceful shutdown', { error });
          process.exit(1);
        }
      });

      setTimeout(() => {
        logger.error('Graceful shutdown timeout, forcing exit');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception', { error });
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled rejection', { reason });
      gracefulShutdown('unhandledRejection');
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

startServer();
