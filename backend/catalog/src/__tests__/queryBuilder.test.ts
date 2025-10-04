import { buildSearchFilters } from '../utils/queryBuilder';

describe('buildSearchFilters', () => {
  const testCases = [
    {
      name: 'should handle empty filters',
      filters: {},
      expectedClause: '',
      expectedParams: [],
      expectedParamIndex: 1
    },
    {
      name: 'should build full-text search filter',
      filters: { q: 'batman' },
      expectedClause: ` AND (
      to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(director, '')) 
      @@ plainto_tsquery('english', $1)
      OR title ILIKE $2
      OR description ILIKE $2
      OR director ILIKE $2
    )`,
      expectedParams: ['batman', '%batman%'],
      expectedParamIndex: 3
    },
    {
      name: 'should trim whitespace from search query',
      filters: { q: '  dark knight  ' },
      expectedClause: ` AND (
      to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(director, '')) 
      @@ plainto_tsquery('english', $1)
      OR title ILIKE $2
      OR description ILIKE $2
      OR director ILIKE $2
    )`,
      expectedParams: ['dark knight', '%dark knight%'],
      expectedParamIndex: 3
    },
    {
      name: 'should ignore empty search query',
      filters: { q: '   ' },
      expectedClause: '',
      expectedParams: [],
      expectedParamIndex: 1
    },
    {
      name: 'should build genre filter',
      filters: { genres: 'Action,Drama' },
      expectedClause: ' AND genres && $1',
      expectedParams: [['Action', 'Drama']],
      expectedParamIndex: 2
    },
    {
      name: 'should trim whitespace from genres',
      filters: { genres: ' Action , Drama , Sci-Fi ' },
      expectedClause: ' AND genres && $1',
      expectedParams: [['Action', 'Drama', 'Sci-Fi']],
      expectedParamIndex: 2
    },
    {
      name: 'should ignore empty genre list',
      filters: { genres: '  ,  ,  ' },
      expectedClause: '',
      expectedParams: [],
      expectedParamIndex: 1
    },
    {
      name: 'should build year minimum filter',
      filters: { yearMin: '2000' },
      expectedClause: ' AND release_year >= $1',
      expectedParams: [2000],
      expectedParamIndex: 2
    },
    {
      name: 'should build year maximum filter',
      filters: { yearMax: '2020' },
      expectedClause: ' AND release_year <= $1',
      expectedParams: [2020],
      expectedParamIndex: 2
    },
    {
      name: 'should build year range filter',
      filters: { yearMin: '2000', yearMax: '2020' },
      expectedClause: ' AND release_year >= $1 AND release_year <= $2',
      expectedParams: [2000, 2020],
      expectedParamIndex: 3
    },
    {
      name: 'should ignore invalid year values',
      filters: { yearMin: 'invalid', yearMax: 'also-invalid' },
      expectedClause: '',
      expectedParams: [],
      expectedParamIndex: 1
    },
    {
      name: 'should build rating minimum filter',
      filters: { ratingMin: '7.5' },
      expectedClause: ' AND rating >= $1',
      expectedParams: [7.5],
      expectedParamIndex: 2
    },
    {
      name: 'should build rating maximum filter',
      filters: { ratingMax: '9.0' },
      expectedClause: ' AND rating <= $1',
      expectedParams: [9.0],
      expectedParamIndex: 2
    },
    {
      name: 'should build rating range filter',
      filters: { ratingMin: '7.0', ratingMax: '9.0' },
      expectedClause: ' AND rating >= $1 AND rating <= $2',
      expectedParams: [7.0, 9.0],
      expectedParamIndex: 3
    },
    {
      name: 'should build duration minimum filter',
      filters: { durationMin: '90' },
      expectedClause: ' AND duration >= $1',
      expectedParams: [90],
      expectedParamIndex: 2
    },
    {
      name: 'should build duration maximum filter',
      filters: { durationMax: '180' },
      expectedClause: ' AND duration <= $1',
      expectedParams: [180],
      expectedParamIndex: 2
    },
    {
      name: 'should build duration range filter',
      filters: { durationMin: '90', durationMax: '180' },
      expectedClause: ' AND duration >= $1 AND duration <= $2',
      expectedParams: [90, 180],
      expectedParamIndex: 3
    },
    {
      name: 'should combine multiple filters',
      filters: { 
        q: 'dark', 
        genres: 'Action,Drama',
        yearMin: '2008', 
        yearMax: '2012',
        ratingMin: '8.0',
        ratingMax: '9.5',
        durationMin: '120',
        durationMax: '180'
      },
      expectedClause: ` AND (
      to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(director, '')) 
      @@ plainto_tsquery('english', $1)
      OR title ILIKE $2
      OR description ILIKE $2
      OR director ILIKE $2
    ) AND genres && $3 AND release_year >= $4 AND release_year <= $5 AND rating >= $6 AND rating <= $7 AND duration >= $8 AND duration <= $9`,
      expectedParams: ['dark', '%dark%', ['Action', 'Drama'], 2008, 2012, 8.0, 9.5, 120, 180],
      expectedParamIndex: 10
    },
    {
      name: 'should handle partial filter combinations',
      filters: { 
        q: 'batman',
        yearMin: '2000',
        ratingMin: '7.0'
      },
      expectedClause: ` AND (
      to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(director, '')) 
      @@ plainto_tsquery('english', $1)
      OR title ILIKE $2
      OR description ILIKE $2
      OR director ILIKE $2
    ) AND release_year >= $3 AND rating >= $4`,
      expectedParams: ['batman', '%batman%', 2000, 7.0],
      expectedParamIndex: 5
    }
  ];

  testCases.forEach(({ name, filters, expectedClause, expectedParams, expectedParamIndex }) => {
    it(name, () => {
      const result = buildSearchFilters(filters);
      expect(result.whereClause).toBe(expectedClause);
      expect(result.params).toEqual(expectedParams);
      expect(result.paramIndex).toBe(expectedParamIndex);
    });
  });

  describe('custom start parameter index', () => {
    it('should respect custom startParamIndex', () => {
      const result = buildSearchFilters({ yearMin: '2000' }, 5);
      expect(result.whereClause).toBe(' AND release_year >= $5');
      expect(result.params).toEqual([2000]);
      expect(result.paramIndex).toBe(6);
    });

    it('should handle complex filters with custom startParamIndex', () => {
      const result = buildSearchFilters({ 
        q: 'test',
        yearMin: '2000'
      }, 10);
      expect(result.whereClause).toContain('$10');
      expect(result.whereClause).toContain('$11');
      expect(result.whereClause).toContain('$12');
      expect(result.paramIndex).toBe(13);
    });
  });

  describe('type handling', () => {
    it('should ignore non-string query values', () => {
      const result = buildSearchFilters({ q: ['array', 'value'] as any });
      expect(result.whereClause).toBe('');
      expect(result.params).toEqual([]);
    });

    it('should ignore non-string genre values', () => {
      const result = buildSearchFilters({ genres: 123 as any });
      expect(result.whereClause).toBe('');
      expect(result.params).toEqual([]);
    });
  });
});
