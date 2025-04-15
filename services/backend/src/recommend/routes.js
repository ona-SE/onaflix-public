const express = require('express');
const router = express.Router();

// Simulated recommendation engine
let recommendations = [];

// Initialize recommendations
const initializeRecommendations = async () => {
  try {
    // In a real implementation, this would fetch from the database
    const response = await fetch('http://localhost:5432/recommendations');
    if (response.ok) {
      const data = await response.json();
      recommendations = data;
    }
  } catch (error) {
    console.log('Using static recommendation data due to database connection error:', error.message);
    // Populate with static data (userId, contentId combinations)
    recommendations = [
      { userId: '1', contentId: '2', contentType: 'movie', score: 0.85, reason: 'Similar to content you watched' },
      { userId: '1', contentId: '3', contentType: 'show', score: 0.78, reason: 'Popular in your area' },
      { userId: '2', contentId: '1', contentType: 'movie', score: 0.92, reason: 'Based on your preferences' },
      { userId: '2', contentId: '4', contentType: 'show', score: 0.81, reason: 'Trending now' },
      { userId: '3', contentId: '5', contentType: 'movie', score: 0.88, reason: 'New release' },
      { userId: '3', contentId: '2', contentType: 'show', score: 0.76, reason: 'Similar to content you watched' },
      { userId: '4', contentId: '3', contentType: 'movie', score: 0.79, reason: 'Based on your preferences' },
      { userId: '4', contentId: '1', contentType: 'show', score: 0.83, reason: 'Popular in your area' },
      { userId: '5', contentId: '4', contentType: 'movie', score: 0.90, reason: 'Trending now' },
      { userId: '5', contentId: '5', contentType: 'show', score: 0.86, reason: 'New release' }
    ];
  }
};

initializeRecommendations();

// Get recommendation engine status
router.get('/status', (req, res) => {
  res.json({
    service: 'Recommendation Engine',
    status: 'active',
    recommendationCount: recommendations.length
  });
});

// Get recommendations for a user
router.get('/users/:userId', (req, res) => {
  const { userId } = req.params;
  const { limit = 5, contentType } = req.query;
  
  let userRecommendations = recommendations.filter(r => r.userId === userId);
  
  // Filter by content type if specified
  if (contentType) {
    userRecommendations = userRecommendations.filter(r => r.contentType === contentType);
  }
  
  // Sort by score (highest first) and limit results
  userRecommendations = userRecommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, parseInt(limit));
  
  res.json(userRecommendations);
});

// Generate new recommendations for a user (simulate algorithm)
router.post('/generate/:userId', (req, res) => {
  const { userId } = req.params;
  const { preferences, history } = req.body;
  
  if (!preferences || !history) {
    return res.status(400).json({ error: 'User preferences and history are required' });
  }
  
  // In a real app, this would run a recommendation algorithm based on preferences and history
  // For demo purposes, we'll generate random recommendations
  
  // Remove existing recommendations for this user
  recommendations = recommendations.filter(r => r.userId !== userId);
  
  // Generate new recommendations
  const contentTypes = ['movie', 'show'];
  const reasons = [
    'Based on your preferences',
    'Similar to content you watched',
    'Popular in your area',
    'Trending now',
    'New release'
  ];
  
  const newRecommendations = [];
  
  for (let i = 1; i <= 5; i++) {
    newRecommendations.push({
      userId,
      contentId: String(i),
      contentType: contentTypes[Math.floor(Math.random() * contentTypes.length)],
      score: (Math.random() * 0.3 + 0.7).toFixed(2), // Generate score between 0.7 and 1.0
      reason: reasons[Math.floor(Math.random() * reasons.length)]
    });
  }
  
  // Add new recommendations to the list
  recommendations = [...recommendations, ...newRecommendations];
  
  res.json({
    success: true,
    recommendations: newRecommendations
  });
});

// Get similarity score between two content items
router.get('/similarity/:contentId1/:contentId2', (req, res) => {
  const { contentId1, contentId2 } = req.params;
  
  // In a real app, this would calculate the similarity based on content features, tags, etc.
  // For demo purposes, we'll generate a random similarity score
  const similarityScore = (Math.random() * 0.8 + 0.2).toFixed(2); // Between 0.2 and 1.0
  
  res.json({
    contentId1,
    contentId2,
    similarityScore: parseFloat(similarityScore)
  });
});

module.exports = router;