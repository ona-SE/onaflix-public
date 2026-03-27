import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import * as Sentry from '@sentry/node';
import { pool } from './config/database';
import { redis } from './config/redis';
import { logger } from './config/logger';
import { MovieRepository } from './repositories/movieRepository';
import { ReviewRepository } from './repositories/reviewRepository';
import { CacheService } from './services/cacheService';
import { MovieService } from './services/movieService';
import { ReviewService } from './services/reviewService';
import { RecommendationService } from './services/recommendationService';
import { MovieController } from './controllers/movieController';
import { HealthController } from './controllers/healthController';
import { ReviewController } from './controllers/reviewController';
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
  const reviewRepository = new ReviewRepository(pool);
  const cacheService = new CacheService(redis);
  const movieService = new MovieService(movieRepository, cacheService);
  const reviewService = new ReviewService(reviewRepository, movieService);
  const recommendationService = new RecommendationService(movieRepository, cacheService);
  const movieController = new MovieController(movieService);
  const healthController = new HealthController(cacheService);
  const reviewController = new ReviewController(reviewService);

  const routes = createRoutes(movieController, healthController, reviewController, recommendationService);
  app.use(routes);

  Sentry.setupExpressErrorHandler(app);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
