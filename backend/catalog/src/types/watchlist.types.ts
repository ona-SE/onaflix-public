/**
 * Types for the watchlist feature (planned for Q3).
 * See: https://linear.app/ona-team/issue/SE-22
 */

export interface WatchlistItem {
  id: number;
  userId: string;
  movieId: number;
  addedAt: Date;
  watchedAt?: Date;
  rating?: number;
  notes?: string;
}

export interface WatchlistCreateInput {
  movieId: number;
  notes?: string;
}

export interface WatchlistUpdateInput {
  watchedAt?: Date;
  rating?: number;
  notes?: string;
}

export interface WatchlistStats {
  totalItems: number;
  watchedCount: number;
  unwatchedCount: number;
  averageRating: number;
  topGenres: { genre: string; count: number }[];
}

export interface WatchlistShareLink {
  id: string;
  watchlistOwnerId: string;
  slug: string;
  isPublic: boolean;
  expiresAt?: Date;
  createdAt: Date;
}

export type WatchlistSortField = 'addedAt' | 'watchedAt' | 'rating' | 'movieTitle';
export type SortDirection = 'asc' | 'desc';

export interface WatchlistQueryParams {
  sort?: WatchlistSortField;
  direction?: SortDirection;
  watched?: boolean;
  limit?: number;
  offset?: number;
}
