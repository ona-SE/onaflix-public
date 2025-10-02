import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { pool } from './config/database';
import { redis } from './config/redis';
import { logger } from './config/logger';
import { MovieRepository } from './repositories/movieRepository';
import { CacheService } from './services/cacheService';
import { MovieService } from './services/movieService';
import { MovieController } from './controllers/movieController';
import { HealthController } from './controllers/healthController';
import { createRoutes } from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { apiLimiter } from './middleware/rateLimiter';

export const createApp = (): Express => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(express.json());
  app.use(requestLogger);
  app.use(apiLimiter);

  const movieRepository = new MovieRepository(pool);
  const cacheService = new CacheService(redis);
  const movieService = new MovieService(movieRepository, cacheService);
  const movieController = new MovieController(movieService);
  const healthController = new HealthController(cacheService);

  const routes = createRoutes(movieController, healthController);
  app.use(routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
