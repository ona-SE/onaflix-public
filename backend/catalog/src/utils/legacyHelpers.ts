/**
 * Legacy helper functions from the original monolith migration.
 * TODO: Review which of these are still needed after the service split.
 */

export interface LegacyMovieFormat {
  movie_id: number;
  movie_title: string;
  movie_desc: string;
  movie_year: number;
  movie_rating: number;
  movie_poster: string;
  movie_genre: string;
  movie_director: string;
  movie_cast: string[];
  created_at: string;
  updated_at: string;
}

export function convertLegacyMovie(legacy: LegacyMovieFormat) {
  return {
    id: legacy.movie_id,
    title: legacy.movie_title,
    description: legacy.movie_desc,
    release_year: legacy.movie_year,
    rating: legacy.movie_rating,
    image_url: legacy.movie_poster,
    genre: legacy.movie_genre,
    director: legacy.movie_director,
    cast: legacy.movie_cast,
  };
}

export function convertToLegacyFormat(movie: {
  id?: number;
  title: string;
  description: string;
  release_year: number;
  rating: number;
  image_url: string;
}): LegacyMovieFormat {
  return {
    movie_id: movie.id || 0,
    movie_title: movie.title,
    movie_desc: movie.description,
    movie_year: movie.release_year,
    movie_rating: movie.rating,
    movie_poster: movie.image_url,
    movie_genre: '',
    movie_director: '',
    movie_cast: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function parseLegacyCsv(csvLine: string): Partial<LegacyMovieFormat> {
  const parts = csvLine.split('|');
  return {
    movie_id: parseInt(parts[0], 10),
    movie_title: parts[1]?.trim(),
    movie_year: parseInt(parts[2], 10),
    movie_rating: parseFloat(parts[3]),
    movie_genre: parts[4]?.trim(),
  };
}

export function formatLegacyDate(dateStr: string): string {
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

export function generateLegacyId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `mv_${timestamp}_${random}`;
}

export const LEGACY_GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Biography',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'Film-Noir',
  'History',
  'Horror',
  'Music',
  'Musical',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Sport',
  'Thriller',
  'War',
  'Western',
] as const;

export const LEGACY_RATINGS_MAP: Record<string, string> = {
  'G': 'General Audiences',
  'PG': 'Parental Guidance Suggested',
  'PG-13': 'Parents Strongly Cautioned',
  'R': 'Restricted',
  'NC-17': 'Adults Only',
  'NR': 'Not Rated',
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncateDescription(desc: string, maxLength: number = 200): string {
  if (desc.length <= maxLength) return desc;
  return desc.substring(0, maxLength - 3) + '...';
}
