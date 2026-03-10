# OnaFlix Setup Guide

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- Redis (optional, for caching)

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/ona-se/ona-flix.git
   cd ona-flix
   ```

2. Install backend dependencies:
   ```bash
   cd backend/catalog
   npm install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set:
   ```
   DATABASE_URL=sqlite://./movies.db
   REDIS_URL=redis://localhost:6379
   PORT=3001
   ```

4. Seed the database:
   ```bash
   npm run dev
   # In another terminal:
   curl -X POST http://localhost:3001/api/movies/seed
   ```

5. Install frontend dependencies:
   ```bash
   cd ../../frontend
   npm install
   ```

6. Start the frontend:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

## Environment Variables

### Backend

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | `sqlite://./movies.db` | SQLite database path |
| `REDIS_URL` | No | `redis://localhost:6379` | Redis connection URL |
| `PORT` | No | `3001` | Express server port |
| `NODE_ENV` | No | `development` | Environment name |
| `LOG_LEVEL` | No | `info` | Winston log level |

### Frontend

The frontend uses Vite's built-in env handling. Create a `.env` file in `frontend/`:

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3001` | Backend API URL |

## Running Tests

### Backend
```bash
cd backend/catalog
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

### Frontend
```bash
cd frontend
npm test              # Run all tests
npm run test:coverage # With coverage report
```

## Docker (Optional)

A `docker-compose.yml` is available for running the full stack:

```bash
docker-compose up -d
```

This starts:
- Backend on port 3001
- Frontend on port 5173
- Redis on port 6379

## Troubleshooting

### "Cannot find module" errors
Run `npm install` in the affected directory.

### Database connection errors
Ensure the `movies.db` file exists in the project root. If not, the seed endpoint will create it.

### Redis connection warnings
Redis is optional. The app works without it but responses won't be cached. Set `REDIS_URL` to empty to suppress warnings.
