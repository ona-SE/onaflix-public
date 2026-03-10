# OnaFlix API Reference

Base URL: `http://localhost:3001`

## Health Check

### `GET /health`

Returns service health status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": {
    "connected": true,
    "responseTime": 5
  },
  "cache": {
    "connected": true,
    "responseTime": 2
  },
  "uptime": 3600
}
```

---

## Movies

### `GET /api/movies`

Returns all movies in the catalog.

**Response:**
```json
[
  {
    "id": 1,
    "title": "The Shawshank Redemption",
    "description": "Two imprisoned men bond over a number of years...",
    "release_year": 1994,
    "rating": 9.3,
    "image_url": "https://example.com/shawshank.jpg",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
]
```

### `GET /api/search`

Search movies with filters.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search query (matches title and description) |
| `genres` | string | Comma-separated genre list |
| `yearMin` | number | Minimum release year |
| `yearMax` | number | Maximum release year |
| `ratingMin` | number | Minimum rating (0-10) |
| `ratingMax` | number | Maximum rating (0-10) |
| `limit` | number | Results per page (default: 50, max: 100) |
| `offset` | number | Pagination offset (default: 0) |

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "title": "The Shawshank Redemption",
      "description": "Two imprisoned men bond over a number of years...",
      "release_year": 1994,
      "rating": 9.3,
      "image_url": "https://example.com/shawshank.jpg"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

### `GET /api/suggestions`

Get autocomplete suggestions for search.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search query (minimum 2 characters) |

**Response:**
```json
[
  {
    "text": "The Shawshank Redemption",
    "type": "title",
    "frequency": 1
  }
]
```

---

## Watchlist

### `GET /api/watchlist`

Returns the user's watchlist.

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "movie_id": 42,
      "added_at": "2024-01-15T10:30:00.000Z",
      "watched": false
    }
  ],
  "total": 1
}
```

### `POST /api/watchlist`

Add a movie to the watchlist.

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Request Body:**
```json
{
  "movie_id": 42
}
```

**Response:**
```json
{
  "id": 1,
  "movie_id": 42,
  "added_at": "2024-01-15T10:30:00.000Z",
  "watched": false
}
```

### `DELETE /api/watchlist/:id`

Remove a movie from the watchlist.

**Headers:**
- `Authorization: Bearer <jwt_token>`

---

## Database Management

### `POST /api/movies/seed`

Seed the database with sample movie data.

**Response:**
```json
{
  "message": "Database seeded successfully"
}
```

### `POST /api/movies/clear`

Clear all movie data from the database.

**Response:**
```json
{
  "message": "Database cleared successfully"
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error description",
  "details": {}
}
```

| Status Code | Description |
|-------------|-------------|
| 400 | Invalid request parameters |
| 401 | Authentication required |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
