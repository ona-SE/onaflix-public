import { Router } from 'express';
import { MovieController } from '../controllers/movieController';
import { HealthController } from '../controllers/healthController';
import { searchLimiter, mutationLimiter } from '../middleware/rateLimiter';

export const createRoutes = (
  movieController: MovieController,
  healthController: HealthController
): Router => {
  const router = Router();

  router.get('/health', healthController.getHealth);

  router.get('/api/movies', movieController.getAllMovies);
  router.get('/api/search', searchLimiter, movieController.searchMovies);
  router.get('/api/suggestions', searchLimiter, movieController.getSuggestions);
  
  router.post('/api/movies/seed', mutationLimiter, movieController.seedDatabase);
  router.post('/api/movies/clear', mutationLimiter, movieController.clearDatabase);

  return router;
};
