interface SearchFilters {
  q?: string;
  genres?: string;
  yearMin?: string;
  yearMax?: string;
  ratingMin?: string;
  ratingMax?: string;
  durationMin?: string;
  durationMax?: string;
}

interface FilterResult {
  whereClause: string;
  params: any[];
  paramIndex: number;
}

export function normalizeSearchFilters(query: any): SearchFilters {
  const normalize = (value: any): string | undefined => {
    if (typeof value === 'string') return value;
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') return value[0];
    return undefined;
  };

  return {
    q: normalize(query.q),
    genres: normalize(query.genres),
    yearMin: normalize(query.yearMin),
    yearMax: normalize(query.yearMax),
    ratingMin: normalize(query.ratingMin),
    ratingMax: normalize(query.ratingMax),
    durationMin: normalize(query.durationMin),
    durationMax: normalize(query.durationMax),
  };
}

export function buildSearchFilters(filters: SearchFilters, startParamIndex: number = 1): FilterResult {
  let whereClause = '';
  const params: any[] = [];
  let paramIndex = startParamIndex;

  const { q, genres, yearMin, yearMax, ratingMin, ratingMax, durationMin, durationMax } = filters;

  // Full-text search
  if (q && typeof q === 'string' && q.trim()) {
    whereClause += ` AND (
      to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(director, '')) 
      @@ plainto_tsquery('english', $${paramIndex})
      OR title ILIKE $${paramIndex + 1}
      OR description ILIKE $${paramIndex + 1}
      OR director ILIKE $${paramIndex + 1}
    )`;
    params.push(q.trim(), `%${q.trim()}%`);
    paramIndex += 2;
  }

  // Genre filtering
  if (genres && typeof genres === 'string') {
    const genreList = genres.split(',').map(g => g.trim()).filter(g => g);
    if (genreList.length > 0) {
      whereClause += ` AND genres && $${paramIndex}`;
      params.push(genreList);
      paramIndex++;
    }
  }

  // Year range filtering
  if (yearMin && !isNaN(Number(yearMin))) {
    whereClause += ` AND release_year >= $${paramIndex}`;
    params.push(Number(yearMin));
    paramIndex++;
  }
  if (yearMax && !isNaN(Number(yearMax))) {
    whereClause += ` AND release_year <= $${paramIndex}`;
    params.push(Number(yearMax));
    paramIndex++;
  }

  // Rating range filtering
  if (ratingMin && !isNaN(Number(ratingMin))) {
    whereClause += ` AND rating >= $${paramIndex}`;
    params.push(Number(ratingMin));
    paramIndex++;
  }
  if (ratingMax && !isNaN(Number(ratingMax))) {
    whereClause += ` AND rating <= $${paramIndex}`;
    params.push(Number(ratingMax));
    paramIndex++;
  }

  // Duration range filtering
  if (durationMin && !isNaN(Number(durationMin))) {
    whereClause += ` AND duration >= $${paramIndex}`;
    params.push(Number(durationMin));
    paramIndex++;
  }
  if (durationMax && !isNaN(Number(durationMax))) {
    whereClause += ` AND duration <= $${paramIndex}`;
    params.push(Number(durationMax));
    paramIndex++;
  }

  return { whereClause, params, paramIndex };
}
