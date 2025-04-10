const express = require('express');
const router = express.Router();

// Simulated analytics data
let analyticsData = {
  userEngagement: {
    daily: [],
    weekly: [],
    monthly: []
  },
  contentPerformance: [],
  streamingMetrics: {
    quality: {},
    bufferingEvents: 0,
    averageWatchTime: 0
  },
  regionData: {
    northAmerica: { users: 0, streams: 0 },
    europe: { users: 0, streams: 0 },
    asia: { users: 0, streams: 0 },
    southAmerica: { users: 0, streams: 0 },
    africa: { users: 0, streams: 0 },
    australia: { users: 0, streams: 0 }
  }
};

// Initialize analytics data
const initializeAnalytics = () => {
  // Generate random user engagement data for the past 30 days
  const now = new Date();
  
  // Daily data for the past 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    analyticsData.userEngagement.daily.push({
      date: date.toISOString().split('T')[0],
      activeUsers: Math.floor(Math.random() * 1000) + 500,
      newUsers: Math.floor(Math.random() * 100) + 50,
      totalWatchTime: Math.floor(Math.random() * 5000) + 2000,
      averageSessionDuration: Math.floor(Math.random() * 60) + 30
    });
  }
  
  // Weekly data for the past 12 weeks
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - (i * 7));
    
    analyticsData.userEngagement.weekly.push({
      week: `Week ${12 - i}`,
      date: date.toISOString().split('T')[0],
      activeUsers: Math.floor(Math.random() * 7000) + 3500,
      newUsers: Math.floor(Math.random() * 700) + 300,
      totalWatchTime: Math.floor(Math.random() * 35000) + 15000,
      averageSessionDuration: Math.floor(Math.random() * 60) + 30
    });
  }
  
  // Monthly data for the past 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    
    analyticsData.userEngagement.monthly.push({
      month: date.toLocaleString('default', { month: 'long' }),
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      activeUsers: Math.floor(Math.random() * 30000) + 15000,
      newUsers: Math.floor(Math.random() * 3000) + 1500,
      totalWatchTime: Math.floor(Math.random() * 150000) + 75000,
      averageSessionDuration: Math.floor(Math.random() * 60) + 30
    });
  }
  
  // Content performance data for top 10 content items
  const contentTypes = ['movie', 'show'];
  const genres = ['action', 'comedy', 'drama', 'sci-fi', 'horror', 'romance', 'documentary', 'animation'];
  
  for (let i = 1; i <= 10; i++) {
    analyticsData.contentPerformance.push({
      contentId: `content-${i}`,
      title: `Content Title ${i}`,
      type: contentTypes[Math.floor(Math.random() * contentTypes.length)],
      genre: genres[Math.floor(Math.random() * genres.length)],
      views: Math.floor(Math.random() * 10000) + 5000,
      completionRate: (Math.random() * 0.5 + 0.5).toFixed(2), // 50-100%
      averageRating: (Math.random() * 2 + 3).toFixed(1), // 3-5 stars
      averageWatchTime: Math.floor(Math.random() * 120) + 60 // 60-180 minutes
    });
  }
  
  // Streaming quality metrics
  analyticsData.streamingMetrics = {
    quality: {
      '4K': Math.floor(Math.random() * 30) + 10, // 10-40%
      'HD': Math.floor(Math.random() * 40) + 40, // 40-80%
      'SD': Math.floor(Math.random() * 20) + 10  // 10-30%
    },
    bufferingEvents: Math.floor(Math.random() * 500) + 100,
    averageWatchTime: Math.floor(Math.random() * 60) + 30 // 30-90 minutes
  };
  
  // Region data
  analyticsData.regionData = {
    northAmerica: { 
      users: Math.floor(Math.random() * 10000) + 5000,
      streams: Math.floor(Math.random() * 20000) + 10000
    },
    europe: { 
      users: Math.floor(Math.random() * 8000) + 4000,
      streams: Math.floor(Math.random() * 16000) + 8000
    },
    asia: { 
      users: Math.floor(Math.random() * 12000) + 6000,
      streams: Math.floor(Math.random() * 24000) + 12000
    },
    southAmerica: { 
      users: Math.floor(Math.random() * 5000) + 2500,
      streams: Math.floor(Math.random() * 10000) + 5000
    },
    africa: { 
      users: Math.floor(Math.random() * 3000) + 1500,
      streams: Math.floor(Math.random() * 6000) + 3000
    },
    australia: { 
      users: Math.floor(Math.random() * 2000) + 1000,
      streams: Math.floor(Math.random() * 4000) + 2000
    }
  };
};

initializeAnalytics();

// Get analytics service status
router.get('/status', (req, res) => {
  res.json({
    service: 'Analytics Service',
    status: 'active',
    dataPoints: Object.keys(analyticsData).length
  });
});

// Get user engagement metrics
router.get('/engagement', (req, res) => {
  const { period = 'daily' } = req.query;
  
  if (['daily', 'weekly', 'monthly'].includes(period)) {
    res.json(analyticsData.userEngagement[period]);
  } else {
    res.status(400).json({ error: 'Invalid period. Use daily, weekly, or monthly.' });
  }
});

// Get content performance metrics
router.get('/content', (req, res) => {
  const { limit = 10, sortBy = 'views' } = req.query;
  
  const validSortFields = ['views', 'completionRate', 'averageRating', 'averageWatchTime'];
  
  if (!validSortFields.includes(sortBy)) {
    return res.status(400).json({ error: `Invalid sort field. Use one of: ${validSortFields.join(', ')}` });
  }
  
  const sortedContent = [...analyticsData.contentPerformance]
    .sort((a, b) => b[sortBy] - a[sortBy])
    .slice(0, parseInt(limit));
  
  res.json(sortedContent);
});

// Get streaming quality metrics
router.get('/streaming', (req, res) => {
  res.json(analyticsData.streamingMetrics);
});

// Get regional data
router.get('/regions', (req, res) => {
  res.json(analyticsData.regionData);
});

// Record analytics event (simplified for demo)
router.post('/events', (req, res) => {
  const { eventType, data } = req.body;
  
  if (!eventType || !data) {
    return res.status(400).json({ error: 'Event type and data are required' });
  }
  
  // In a real app, this would process and store the event data
  // For demo purposes, we'll just acknowledge receipt
  
  console.log(`Received ${eventType} event:`, data);
  
  res.json({
    success: true,
    message: `${eventType} event recorded`
  });
});

module.exports = router;