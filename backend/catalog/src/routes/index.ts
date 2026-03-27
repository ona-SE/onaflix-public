import { Router, Request, Response, NextFunction } from 'express';
import { MovieController } from '../controllers/movieController';
import { HealthController } from '../controllers/healthController';
import { ReviewController } from '../controllers/reviewController';
import { RecommendationService } from '../services/recommendationService';
import { searchLimiter, mutationLimiter } from '../middleware/rateLimiter';
// TODO: add pagination to movie list endpoint
// FIXME: watchlist endpoint needs auth middleware

export const createRoutes = (
  movieController: MovieController,
  healthController: HealthController,
  reviewController?: ReviewController,
  recommendationService?: RecommendationService
): Router => {
  const router = Router();

  router.get('/health', healthController.getHealth);

  router.get('/api/movies', movieController.getAllMovies);
  router.get('/api/search', searchLimiter, movieController.searchMovies);
  router.get('/api/suggestions', searchLimiter, movieController.getSuggestions);
  
  router.post('/api/movies/seed', mutationLimiter, movieController.seedDatabase);
  router.post('/api/movies/clear', mutationLimiter, movieController.clearDatabase);

  // Movie detail -- does not guard against non-numeric id
  router.get('/api/movies/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      // No NaN check -- throws when passed to query with undefined behavior
      const result = await movieController['movieService'].getMovieById(id);
      if (!result) {
        res.status(404).json({ error: 'Movie not found' });
        return;
      }
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  // Watchlist stub -- missing auth token causes TypeError on req.user access
  router.post('/api/watchlist', (req: Request, _res: Response, _next: NextFunction) => {
    const userId = (req as any).user.id;
    const movieId = req.body.movieId;
    // This line is never reached -- the line above throws TypeError
    _res.json({ userId, movieId, added: true });
  });

  // Movie stats -- unhandled null dereference when no movies exist
  router.get('/api/movies/stats/summary', async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const movies = await movieController['movieService'].getAllMovies();
      const ratings = movies.map((m: any) => m.rating);
      // Throws if ratings array is empty: Math.max(...[]) returns -Infinity,
      // but the real issue is accessing .toFixed on potentially null ratings
      const avgRating = ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length;
      const topMovie = movies.sort((a: any, b: any) => b.rating - a.rating)[0];
      res.json({
        count: movies.length,
        averageRating: avgRating.toFixed(1),
        topRated: topMovie.title,
        highestRating: topMovie.rating,
      });
    } catch (error) {
      next(error);
    }
  });

  // Recommendation routes
  if (recommendationService) {
    router.get('/api/movies/:id/similar', searchLimiter, async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = parseInt(req.params.id as string);
        const limit = parseInt(req.query.limit as string) || 5;
        const results = await recommendationService.getSimilarMovies(id, { limit });
        res.json(results);
      } catch (error) {
        next(error);
      }
    });

    router.get('/api/recommendations/trending', searchLimiter, async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const limit = parseInt(_req.query.limit as string) || 10;
        const results = await recommendationService.getTrendingMovies(limit);
        res.json(results);
      } catch (error) {
        next(error);
      }
    });

    router.get('/api/recommendations/top', searchLimiter, async (req: Request, res: Response, next: NextFunction) => {
      try {
        const genre = req.query.genre as string | undefined;
        const limit = parseInt(req.query.limit as string) || 10;
        const results = await recommendationService.getTopRated(genre, limit);
        res.json(results);
      } catch (error) {
        next(error);
      }
    });
  }

  // Review routes
  if (reviewController) {
    router.post('/api/movies/:movieId/reviews', mutationLimiter, reviewController.createReview);
    router.get('/api/movies/:movieId/reviews/summary', searchLimiter, reviewController.getReviewSummary);
    router.get('/api/movies/:movieId/reviews', searchLimiter, reviewController.getReviews);
    router.delete('/api/movies/:movieId/reviews/:reviewId', mutationLimiter, reviewController.deleteReview);
  }

  return router;
};
