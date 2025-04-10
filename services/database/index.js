const express = require('express');
const { sequelize, models } = require('./models');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.DB_PORT || 3306;

console.log('Using SQLite database for demo environment');

// Initialize database and sync tables
async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    await sequelize.sync({ force: true }); // This will create tables
    console.log('Database tables created.');
    
    // Run seeding directly if database is fresh
    try {
      console.log('Seeding database with sample data...');
      const seed = require('./seed');
      await seed();
      console.log('Database seeded successfully!');
    } catch (seedError) {
      console.error('Error seeding database:', seedError.message);
      if (seedError.parent) {
        console.error('DB Error:', seedError.parent);
      }
    }
    
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Database service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    if (error.parent && error.parent.sql) {
      console.error('SQL error:', error.parent.sql);
    }
  }
}

// API endpoints for database operations
app.use(express.json());

// Status endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Database service running' });
});

// Get database stats
app.get('/stats', async (req, res) => {
  try {
    const [movies] = await sequelize.query('SELECT COUNT(*) FROM "Movies"');
    const [shows] = await sequelize.query('SELECT COUNT(*) FROM "Shows"');
    const [users] = await sequelize.query('SELECT COUNT(*) FROM "Users"');
    const [streams] = await sequelize.query('SELECT COUNT(*) FROM "Streams"');
    
    res.json({
      movies: movies[0].count,
      shows: shows[0].count,
      users: users[0].count,
      streams: streams[0].count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize the database
initDatabase();

module.exports = { sequelize, models };