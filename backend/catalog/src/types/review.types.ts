export interface Review {
  id: number;
  movie_id: number;
  user_name: string;
  rating: number;
  text: string;
  created_at: Date;
}

export interface ReviewSummary {
  movie_id: number;
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    [key: string]: number;
  };
}

export interface PaginatedReviews {
  reviews: Review[];
  total: number;
  limit: number;
  offset: number;
}
