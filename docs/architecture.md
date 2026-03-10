# OnaFlix Architecture Overview

## System Diagram

```
┌─────────────┐     ┌──────────────┐     ┌──────────┐
│   Frontend   │────▶│   Backend    │────▶│ Database │
│  React/Vite  │     │   Express    │     │  SQLite  │
└─────────────┘     └──────┬───────┘     └──────────┘
                           │
                    ┌──────┴───────┐
                    │    Cache     │
                    │    Redis     │
                    └──────────────┘
```

## Components

### Frontend
- **Framework:** React 19 with Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v7
- **State:** Local component state (no global store)

### Backend (Catalog Service)
- **Runtime:** Node.js with TypeScript
- **Framework:** Express 5
- **Validation:** Zod schemas
- **Logging:** Winston

### Database
- **Engine:** SQLite 3
- **Location:** `movies.db` in project root
- **Schema:** Single `movies` table with full-text search

### Cache Layer
- **Engine:** Redis (optional)
- **Strategy:** Cache-aside with TTL
- **TTLs:** Movies list (5min), Search results (3min), Suggestions (2min)

## Data Flow

1. Client sends request to Express API
2. Controller validates input with Zod
3. Service checks Redis cache
4. On cache miss, queries SQLite via Repository
5. Result cached in Redis, returned to client

## Directory Structure

```
ona-flix/
├── backend/
│   └── catalog/
│       └── src/
│           ├── controllers/    # Request handlers
│           ├── services/       # Business logic
│           ├── repositories/   # Data access
│           ├── middleware/      # Express middleware
│           ├── config/         # Database, Redis, Logger
│           ├── types/          # TypeScript interfaces
│           └── utils/          # Helper functions
├── frontend/
│   └── src/
│       ├── components/         # React components
│       ├── services/           # API client
│       └── utils/              # Frontend utilities
├── database/
│   └── schema.sql
└── docs/
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `sqlite://./movies.db` | Database connection string |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection URL |
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment name |

## Rate Limiting

- Search endpoints: 30 requests per minute per IP
- Mutation endpoints: 10 requests per minute per IP
- All other endpoints: No rate limit
