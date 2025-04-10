const express = require('express');
const router = express.Router();

// Simulated user database
let users = [];

// Fetch users from database on startup
const initializeUsers = async () => {
  try {
    // In a real implementation, this would fetch from the database
    const response = await fetch('http://localhost:5432/users');
    if (response.ok) {
      const data = await response.json();
      users = data;
    }
  } catch (error) {
    console.log('Using static user data due to database connection error:', error.message);
    // Populate with static data
    users = [
      { id: '1', username: 'user1', email: 'user1@example.com', preferences: { genres: ['action', 'sci-fi'] } },
      { id: '2', username: 'user2', email: 'user2@example.com', preferences: { genres: ['comedy', 'romance'] } },
      { id: '3', username: 'user3', email: 'user3@example.com', preferences: { genres: ['horror', 'thriller'] } },
      { id: '4', username: 'user4', email: 'user4@example.com', preferences: { genres: ['documentary', 'drama'] } },
      { id: '5', username: 'user5', email: 'user5@example.com', preferences: { genres: ['animation', 'family'] } }
    ];
  }
};

initializeUsers();

// Get identity service status
router.get('/status', (req, res) => {
  res.json({
    service: 'User Management',
    status: 'active',
    userCount: users.length
  });
});

// Get all users (admin only in a real app)
router.get('/users', (req, res) => {
  // In a real app, we would check authorization here
  const sanitizedUsers = users.map(({ id, username, preferences }) => ({ id, username, preferences }));
  res.json(sanitizedUsers);
});

// Get user by ID
router.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (user) {
    // In a real app, we would check authorization and sanitize sensitive data
    const { password, ...userData } = user;
    res.json(userData);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// User authentication (simplified for demo)
router.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  // In a real app, we would validate credentials against database
  const user = users.find(u => u.username === username);
  
  if (user) {
    // In a real app, we would check password hash and generate JWT token
    res.json({
      id: user.id,
      username: user.username,
      token: `demo-token-${user.id}`
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Update user preferences
router.put('/users/:id/preferences', (req, res) => {
  const { id } = req.params;
  const { preferences } = req.body;
  
  if (!preferences) {
    return res.status(400).json({ error: 'Preferences are required' });
  }
  
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex !== -1) {
    users[userIndex].preferences = {
      ...users[userIndex].preferences,
      ...preferences
    };
    res.json({ success: true, preferences: users[userIndex].preferences });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Update watch history
router.post('/users/:id/history', (req, res) => {
  const { id } = req.params;
  const { contentId, contentType, progress } = req.body;
  
  if (!contentId || !contentType) {
    return res.status(400).json({ error: 'Content ID and type are required' });
  }
  
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex !== -1) {
    // Initialize watch history if it doesn't exist
    if (!users[userIndex].watchHistory) {
      users[userIndex].watchHistory = [];
    }
    
    // Update existing entry or add new one
    const historyIndex = users[userIndex].watchHistory.findIndex(
      h => h.contentId === contentId && h.contentType === contentType
    );
    
    if (historyIndex !== -1) {
      users[userIndex].watchHistory[historyIndex].progress = progress;
      users[userIndex].watchHistory[historyIndex].lastWatched = new Date().toISOString();
    } else {
      users[userIndex].watchHistory.push({
        contentId,
        contentType,
        progress,
        lastWatched: new Date().toISOString()
      });
    }
    
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

module.exports = router;