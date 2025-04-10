const express = require('express');
const router = express.Router();

// Simulated content catalog data store
let contentCatalog = {
  movies: [],
  shows: []
};

// Fetch data from database on startup
const initializeCatalog = async () => {
  try {
    // In a real implementation, this would fetch from the database
    // For demo purposes, we'll populate with static data if the database connection fails
    const response = await fetch('http://localhost:5432/movies');
    if (response.ok) {
      const data = await response.json();
      contentCatalog.movies = data;
    }
    
    const showsResponse = await fetch('http://localhost:5432/shows');
    if (showsResponse.ok) {
      const data = await showsResponse.json();
      contentCatalog.shows = data;
    }
  } catch (error) {
    console.log('Using static catalog data due to database connection error:', error.message);
    // Populate with static data
    contentCatalog = {
      movies: [
        { id: '1', title: 'Space Adventure', genre: ['sci-fi', 'action'], rating: 4.5 },
        { id: '2', title: 'Love Story', genre: ['romance', 'drama'], rating: 4.2 },
        { id: '3', title: 'Nightmare House', genre: ['horror', 'thriller'], rating: 3.8 },
        { id: '4', title: 'Laugh Out Loud', genre: ['comedy', 'family'], rating: 4.0 },
        { id: '5', title: 'Ocean Depths', genre: ['documentary', 'nature'], rating: 4.7 }
      ],
      shows: [
        { id: '1', title: 'Galaxy Wars', genre: ['sci-fi', 'action'], seasons: 3, rating: 4.6 },
        { id: '2', title: 'City Life', genre: ['drama', 'comedy'], seasons: 5, rating: 4.3 },
        { id: '3', title: 'Monster Hunters', genre: ['horror', 'adventure'], seasons: 4, rating: 4.1 },
        { id: '4', title: 'Family Values', genre: ['comedy', 'family'], seasons: 6, rating: 4.0 },
        { id: '5', title: 'True Nature', genre: ['documentary', 'nature'], seasons: 2, rating: 4.8 }
      ]
    };
  }
};

initializeCatalog();

// Get content catalog status
router.get('/status', (req, res) => {
  res.json({
    service: 'Content Catalog',
    status: 'active',
    movies: contentCatalog.movies.length,
    shows: contentCatalog.shows.length
  });
});

// Get all movies
router.get('/movies', (req, res) => {
  res.json(contentCatalog.movies);
});

// Get movie by ID
router.get('/movies/:id', (req, res) => {
  const movie = contentCatalog.movies.find(m => m.id === req.params.id);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ error: 'Movie not found' });
  }
});

// Get all shows
router.get('/shows', (req, res) => {
  res.json(contentCatalog.shows);
});

// Get show by ID
router.get('/shows/:id', (req, res) => {
  const show = contentCatalog.shows.find(s => s.id === req.params.id);
  if (show) {
    res.json(show);
  } else {
    res.status(404).json({ error: 'Show not found' });
  }
});

// Search content by title or genre
router.get('/search', (req, res) => {
  const { query, type } = req.query;
  let results = [];
  
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  
  const searchInList = (list) => {
    return list.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
    );
  };
  
  if (!type || type === 'all') {
    results = [
      ...searchInList(contentCatalog.movies),
      ...searchInList(contentCatalog.shows)
    ];
  } else if (type === 'movie') {
    results = searchInList(contentCatalog.movies);
  } else if (type === 'show') {
    results = searchInList(contentCatalog.shows);
  } else {
    return res.status(400).json({ error: 'Invalid content type' });
  }
  
  res.json(results);
});

module.exports = router;