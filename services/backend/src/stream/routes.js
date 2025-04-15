const express = require('express');
const router = express.Router();

// Simulated streaming sessions
let activeStreams = [];

// Get streaming service status
router.get('/status', (req, res) => {
  res.json({
    service: 'Streaming Service',
    status: 'active',
    activeStreams: activeStreams.length
  });
});

// Get all active streams (admin only in a real app)
router.get('/sessions', (req, res) => {
  // In a real app, we would check authorization here
  res.json(activeStreams);
});

// Start a new streaming session
router.post('/sessions', (req, res) => {
  const { userId, contentId, contentType, quality, deviceType } = req.body;
  
  if (!userId || !contentId || !contentType) {
    return res.status(400).json({ error: 'User ID, content ID, and content type are required' });
  }
  
  // Generate session ID
  const sessionId = `stream-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Create new streaming session
  const newSession = {
    sessionId,
    userId,
    contentId,
    contentType,
    quality: quality || 'auto',
    deviceType: deviceType || 'unknown',
    startTime: new Date().toISOString(),
    metrics: {
      bufferingEvents: 0,
      qualityChanges: 0,
      averageBitrate: 0
    }
  };
  
  activeStreams.push(newSession);
  
  res.json({
    success: true,
    session: newSession
  });
});

// Update streaming session metrics
router.put('/sessions/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const { metrics } = req.body;
  
  if (!metrics) {
    return res.status(400).json({ error: 'Metrics data is required' });
  }
  
  const sessionIndex = activeStreams.findIndex(s => s.sessionId === sessionId);
  
  if (sessionIndex !== -1) {
    // Update session metrics
    activeStreams[sessionIndex].metrics = {
      ...activeStreams[sessionIndex].metrics,
      ...metrics
    };
    
    res.json({
      success: true,
      session: activeStreams[sessionIndex]
    });
  } else {
    res.status(404).json({ error: 'Streaming session not found' });
  }
});

// End streaming session
router.delete('/sessions/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  const sessionIndex = activeStreams.findIndex(s => s.sessionId === sessionId);
  
  if (sessionIndex !== -1) {
    // Calculate session duration
    const session = activeStreams[sessionIndex];
    const startTime = new Date(session.startTime);
    const endTime = new Date();
    const duration = Math.floor((endTime - startTime) / 1000); // in seconds
    
    // Remove session from active streams
    const completedSession = {
      ...activeStreams[sessionIndex],
      endTime: endTime.toISOString(),
      duration
    };
    
    activeStreams.splice(sessionIndex, 1);
    
    // In a real app, we would save the completed session to the database
    
    res.json({
      success: true,
      session: completedSession
    });
  } else {
    res.status(404).json({ error: 'Streaming session not found' });
  }
});

// Get CDN status (simplified for demo)
router.get('/cdn/status', (req, res) => {
  // In a real app, this would check the status of multiple CDN endpoints
  res.json({
    cdnStatus: 'healthy',
    regions: [
      { name: 'North America', status: 'optimal', latency: 15 },
      { name: 'Europe', status: 'optimal', latency: 18 },
      { name: 'Asia', status: 'good', latency: 42 },
      { name: 'Australia', status: 'good', latency: 38 },
      { name: 'South America', status: 'fair', latency: 85 }
    ]
  });
});

module.exports = router;