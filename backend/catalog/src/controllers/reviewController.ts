import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/reviewService';
import { CreateReviewSchema, ReviewPaginationSchema } from '../types/api.types';
import { ZodError } from 'zod';

export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  createReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const movieId = parseInt(req.params.movieId as string);
      if (isNaN(movieId)) {
        res.status(400).json({ error: 'Invalid movie ID' });
        return;
      }

      const validated = CreateReviewSchema.parse(req.body);
      const review = await this.reviewService.createReview(movieId, validated);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: 'Invalid input', details: error.issues });
        return;
      }
      next(error);
    }
  };

  getReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const movieId = parseInt(req.params.movieId as string);
      if (isNaN(movieId)) {
        res.status(400).json({ error: 'Invalid movie ID' });
        return;
      }

      const { limit, offset } = ReviewPaginationSchema.parse(req.query);
      const result = await this.reviewService.getReviews(movieId, limit, offset);
      res.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: 'Invalid query parameters', details: error.issues });
        return;
      }
      next(error);
    }
  };

  deleteReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const movieId = parseInt(req.params.movieId as string);
      const reviewId = parseInt(req.params.reviewId as string);
      if (isNaN(movieId) || isNaN(reviewId)) {
        res.status(400).json({ error: 'Invalid ID' });
        return;
      }

      await this.reviewService.deleteReview(movieId, reviewId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getReviewSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const movieId = parseInt(req.params.movieId as string);
      if (isNaN(movieId)) {
        res.status(400).json({ error: 'Invalid movie ID' });
        return;
      }

      const summary = await this.reviewService.getReviewSummary(movieId);
      res.json(summary);
    } catch (error) {
      next(error);
    }
  };
}
