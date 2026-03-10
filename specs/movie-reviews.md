# Feature Spec: Movie Reviews

## Overview

Users can write text reviews for movies. Reviews are public and displayed on the movie detail page in reverse chronological order. Each review includes a star rating (1-5) and text body.

## Data Model

### reviews table

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| movie_id | INTEGER | NOT NULL, REFERENCES movies(id) ON DELETE CASCADE |
| user_name | VARCHAR(100) | NOT NULL |
| rating | INTEGER | NOT NULL, CHECK (rating >= 1 AND rating <= 5) |
| text | TEXT | NOT NULL, CHECK (char_length(text) >= 10 AND char_length(text) <= 2000) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |

Index on (movie_id, created_at DESC) for efficient listing.

## API Endpoints

### POST /api/movies/:movieId/reviews

Create a review for a movie.

**Request body:**
```json
{
  "user_name": "string (required, 1-100 chars)",
  "rating": "integer (required, 1-5)",
  "text": "string (required, 10-2000 chars)"
}
```

**Response (201):**
```json
{
  "id": 1,
  "movie_id": 42,
  "user_name": "Jane Doe",
  "rating": 4,
  "text": "A masterpiece of modern cinema...",
  "created_at": "2026-03-10T12:00:00Z"
}
```

**Errors:**
- 400: Invalid input (Zod validation)
- 404: Movie not found

### GET /api/movies/:movieId/reviews

List reviews for a movie, sorted by created_at DESC. Paginated.

**Query parameters:**
- `limit` (optional, default 10, max 50)
- `offset` (optional, default 0)

**Response (200):**
```json
{
  "reviews": [
    {
      "id": 1,
      "movie_id": 42,
      "user_name": "Jane Doe",
      "rating": 4,
      "text": "A masterpiece of modern cinema...",
      "created_at": "2026-03-10T12:00:00Z"
    }
  ],
  "total": 25,
  "limit": 10,
  "offset": 0
}
```

**Errors:**
- 404: Movie not found

### DELETE /api/movies/:movieId/reviews/:reviewId

Delete a review by ID.

**Response (204):** No content.

**Errors:**
- 404: Review not found

### GET /api/movies/:movieId/reviews/summary

Get aggregate review stats for a movie.

**Response (200):**
```json
{
  "movie_id": 42,
  "average_rating": 4.2,
  "total_reviews": 25,
  "rating_distribution": {
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 10,
    "5": 9
  }
}
```

## Implementation Notes

- Follow existing patterns: Repository -> Service -> Controller -> Routes
- Use Zod for input validation (see existing SearchQuerySchema pattern)
- Use parameterized queries (see existing movieRepository.ts pattern)
- Apply rate limiting to POST and DELETE endpoints (use existing mutationLimiter)
- Apply searchLimiter to GET endpoints

## Tests

Write tests covering:
1. Creating a review with valid input
2. Creating a review with invalid input (missing fields, rating out of range, text too short/long)
3. Creating a review for a non-existent movie
4. Listing reviews with pagination
5. Listing reviews for a movie with no reviews (empty array)
6. Deleting a review
7. Deleting a non-existent review
8. Getting review summary stats
