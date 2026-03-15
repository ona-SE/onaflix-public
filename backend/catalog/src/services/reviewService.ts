import { ReviewRepository } from '../repositories/reviewRepository';
import { MovieService } from './movieService';
import { Review, ReviewSummary, PaginatedReviews } from '../types/review.types';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../config/logger';

export class ReviewService {
  constructor(
    private reviewRepository: ReviewRepository,
    private movieService: MovieService
  ) {}

  async createReview(movieId: number, data: { user_name: string; rating: number; text: string }): Promise<Review> {
    const movie = await this.movieService.getMovieById(movieId);
    if (!movie) {
      throw new AppError(404, 'Movie not found');
    }

    return this.reviewRepository.create(movieId, data.user_name, data.rating, data.text);
  }

  async getReviews(movieId: number, limit: number, offset: number): Promise<PaginatedReviews> {
    const movie = await this.movieService.getMovieById(movieId);
    if (!movie) {
      throw new AppError(404, 'Movie not found');
    }

    const { reviews, total } = await this.reviewRepository.findByMovieId(movieId, limit, offset);
    return { reviews, total, limit, offset };
  }

  async deleteReview(movieId: number, reviewId: number): Promise<void> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new AppError(404, 'Review not found');
    }

    await this.reviewRepository.deleteById(reviewId);
  }

  async getReviewSummary(movieId: number): Promise<ReviewSummary> {
    const movie = await this.movieService.getMovieById(movieId);
    if (!movie) {
      throw new AppError(404, 'Movie not found');
    }

    return this.reviewRepository.getSummary(movieId);
  }
}
