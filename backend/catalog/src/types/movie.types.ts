export interface Movie {
  id: number;
  title: string;
  description: string | null;
  release_year: number | null;
  rating: number | null;
  image_url: string | null;
  duration: number | null;
  director: string | null;
  genres: string[] | null;
  movie_cast: string[] | null;
  trailer_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface MovieSearchFilters {
  q?: string;
  genres?: string[];
  yearMin?: number;
  yearMax?: number;
  ratingMin?: number;
  ratingMax?: number;
  durationMin?: number;
  durationMax?: number;
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  results: Movie[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface Suggestion {
  text: string;
  type: 'title' | 'director' | 'actor' | 'genre';
  frequency: number;
}
