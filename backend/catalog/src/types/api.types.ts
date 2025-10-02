import { z } from 'zod';

export const SearchQuerySchema = z.object({
  q: z.string().optional(),
  genres: z.string().optional(),
  yearMin: z.coerce.number().int().min(1900).max(2100).optional(),
  yearMax: z.coerce.number().int().min(1900).max(2100).optional(),
  ratingMin: z.coerce.number().min(0).max(10).optional(),
  ratingMax: z.coerce.number().min(0).max(10).optional(),
  durationMin: z.coerce.number().int().min(0).optional(),
  durationMax: z.coerce.number().int().min(0).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

export const SuggestionsQuerySchema = z.object({
  q: z.string().min(2, 'Query must be at least 2 characters'),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type SuggestionsQuery = z.infer<typeof SuggestionsQuerySchema>;

export interface ApiError {
  error: string;
  details?: unknown;
}

export interface HealthStatus {
  status: 'OK' | 'DEGRADED' | 'ERROR';
  timestamp: string;
  database: {
    connected: boolean;
    responseTime?: number;
  };
  cache: {
    connected: boolean;
    responseTime?: number;
  };
  uptime: number;
}
