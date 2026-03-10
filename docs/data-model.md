# OnaFlix Data Model

## Movies Table

The primary table storing all movie data.

```sql
CREATE TABLE movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  release_year INTEGER,
  rating REAL CHECK(rating >= 0 AND rating <= 10),
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Fields

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | INTEGER | No | Auto-incrementing primary key |
| `title` | TEXT | No | Movie title |
| `description` | TEXT | Yes | Movie synopsis |
| `release_year` | INTEGER | Yes | Year of release |
| `rating` | REAL | Yes | Rating from 0.0 to 10.0 |
| `image_url` | TEXT | Yes | URL to poster image |
| `created_at` | DATETIME | No | Record creation timestamp |
| `updated_at` | DATETIME | No | Last update timestamp |

### Indexes

```sql
CREATE INDEX idx_movies_title ON movies(title);
CREATE INDEX idx_movies_release_year ON movies(release_year);
CREATE INDEX idx_movies_rating ON movies(rating);
```

## TypeScript Interface

```typescript
interface Movie {
  id: number;
  title: string;
  description: string | null;
  release_year: number | null;
  rating: number | null;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
}
```

## Search Filters

```typescript
interface MovieSearchFilters {
  q?: string;           // Full-text search query
  yearMin?: number;     // Minimum release year
  yearMax?: number;     // Maximum release year
  ratingMin?: number;   // Minimum rating
  ratingMax?: number;   // Maximum rating
  limit?: number;       // Results per page (default: 50)
  offset?: number;      // Pagination offset
}
```

## Suggestions

The suggestions endpoint returns autocomplete results from movie titles.

```typescript
interface Suggestion {
  text: string;
  type: 'title';
  frequency: number;
}
```

## Notes

- The database uses SQLite for simplicity. No migration tool is used — the schema is applied on first seed.
- Full-text search uses SQLite's FTS5 extension for the `title` and `description` columns.
- The `rating` field is user-submitted and not validated against any external source.
