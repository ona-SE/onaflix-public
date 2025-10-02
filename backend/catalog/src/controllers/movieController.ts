import { Request, Response, NextFunction } from 'express';
import { MovieService } from '../services/movieService';
import { SearchQuerySchema, SuggestionsQuerySchema } from '../types/api.types';
import { logger } from '../config/logger';
import { ZodError } from 'zod';

export class MovieController {
  constructor(private movieService: MovieService) {}

  getAllMovies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const movies = await this.movieService.getAllMovies();
      res.json(movies);
    } catch (error) {
      next(error);
    }
  };

  searchMovies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedQuery = SearchQuerySchema.parse(req.query);
      
      const filters: any = { ...validatedQuery };
      if (validatedQuery.genres && typeof validatedQuery.genres === 'string') {
        filters.genres = validatedQuery.genres;
      }
      
      const result = await this.movieService.searchMovies(filters);
      res.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Invalid query parameters',
          details: error.issues,
        });
        return;
      }
      next(error);
    }
  };

  getSuggestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string' || q.trim().length < 2) {
        res.json([]);
        return;
      }

      const suggestions = await this.movieService.getSuggestions(q);
      res.json(suggestions);
    } catch (error) {
      next(error);
    }
  };

  seedDatabase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.movieService.seedDatabase();
      res.json({ message: 'Database seeded successfully' });
    } catch (error) {
      next(error);
    }
  };

  clearDatabase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.movieService.clearDatabase();
      res.json({ message: 'Database cleared successfully' });
    } catch (error) {
      next(error);
    }
  };
}
