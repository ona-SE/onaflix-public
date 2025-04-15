# Streaming Platform Database Service

## Overview

This is the database service for the Streaming Platform Demo. It provides persistent storage for all platform data, including content metadata, user profiles, streaming sessions, and recommendations.

## Features

- PostgreSQL database for persistent storage
- Sequelize ORM for database operations
- Database seeding with sample data
- Simple REST API for database status and operations

## Models

### User

Stores user account information and preferences.

**Fields:**
- id: UUID (primary key)
- username: String
- email: String
- preferences: JSONB
- watchHistory: JSONB

### Movie

Stores movie metadata.

**Fields:**
- id: UUID (primary key)
- title: String
- description: Text
- duration: Integer (minutes)
- releaseYear: Integer
- genre: Array[String]
- rating: Float
- imageUrl: String

### Show

Stores TV show metadata.

**Fields:**
- id: UUID (primary key)
- title: String
- description: Text
- seasons: Integer
- episodes: Integer
- releaseYear: Integer
- genre: Array[String]
- rating: Float
- imageUrl: String

### Stream

Records streaming sessions.

**Fields:**
- id: UUID (primary key)
- userId: UUID (foreign key)
- contentId: UUID
- contentType: Enum ('movie', 'show')
- startTime: Date
- duration: Integer (seconds)
- quality: String
- deviceType: String

### Recommendation

Stores content recommendations for users.

**Fields:**
- id: UUID (primary key)
- userId: UUID (foreign key)
- contentId: UUID
- contentType: Enum ('movie', 'show')
- score: Float
- reason: String

## Tech Stack

- **SQLite** - Database (file-based, no server required)
- **Sequelize** - ORM
- **Express** - API framework
- **Node.js** - Runtime environment

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Environment Variables

Optionally, create a `.env` file with the following variables:

```
DB_PORT=3306  # Port for the API server
NODE_ENV=development
```

### Starting the Service

```bash
# Start the database service
npm run start
```

The database will be automatically initialized and seeded with sample data.

### Manually Seeding the Database

If you need to reseed the database:

```bash
# Populate the database with sample data
npm run seed
```

## API Endpoints

- `GET /` - Get database service status
- `GET /stats` - Get database statistics (record counts)

## Database Operations

### Connecting to the Database

The database service creates a Sequelize connection with the following configuration:

```javascript
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // SQLite database file
  logging: false
});
```

### Accessing Models

Models can be imported from the `models.js` file:

```javascript
const { User, Movie, Show, Stream, Recommendation } = require('./models');
```

### Example Query

```javascript
// Find all movies in a genre
const actionMovies = await Movie.findAll({
  where: sequelize.where(
    sequelize.fn('json_extract', sequelize.col('genre'), '$[*]'),
    {[Op.like]: '%"action"%'}
  )
});
```

## Testing

```bash
# Run tests
npm test
```

## Extending the Database

### Adding a New Model

To add a new database model:

1. Define the model in `models.js`
2. Add relationships to existing models if needed
3. Update the exports in `models.js`
4. Add sample data for the new model in `seed.js`
5. Update the database statistics endpoint in `index.js`