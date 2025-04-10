const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const dotenv = require('dotenv');
dotenv.config();

// Import service routes
const catalogRoutes = require('./src/catalog/routes');
const identityRoutes = require('./src/identity/routes');
const recommendRoutes = require('./src/recommend/routes');
const streamRoutes = require('./src/stream/routes');
const analyticsRoutes = require('./src/analytics/routes');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Status endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Backend services running' });
});

// Service routes
app.use('/api/catalog', catalogRoutes);
app.use('/api/identity', identityRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/stream', streamRoutes);
app.use('/api/analytics', analyticsRoutes);

// Create HTTP server
const server = http.createServer(app);

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ server });

// Active service nodes and their status
const serviceNodes = {
  catalog: { id: 'catalog', name: 'Content Catalog', status: 'active', connections: [] },
  identity: { id: 'identity', name: 'User Management', status: 'active', connections: [] },
  recommend: { id: 'recommend', name: 'Recommendation Engine', status: 'active', connections: [] },
  stream: { id: 'stream', name: 'Streaming Service', status: 'active', connections: [] },
  analytics: { id: 'analytics', name: 'Analytics Service', status: 'active', connections: [] },
  database: { id: 'database', name: 'Database', status: 'active', connections: [] }
};

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  // Send initial service nodes state
  ws.send(JSON.stringify({
    type: 'INIT',
    data: {
      nodes: Object.values(serviceNodes),
      connections: generateServiceConnections()
    }
  }));
  
  // Setup interval to simulate service activity
  const interval = setInterval(() => {
    const updates = simulateServiceActivity();
    ws.send(JSON.stringify({
      type: 'UPDATE',
      data: updates
    }));
  }, 3000);
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message:', data);
      
      // Handle different message types
      if (data.type === 'SIMULATE_LOAD') {
        const updates = simulateIncreasedLoad(data.serviceId);
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'UPDATE',
              data: updates
            }));
          }
        });
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

// Generate service connections
function generateServiceConnections() {
  return [
    { source: 'frontend', target: 'catalog', type: 'request' },
    { source: 'frontend', target: 'identity', type: 'request' },
    { source: 'frontend', target: 'recommend', type: 'request' },
    { source: 'frontend', target: 'stream', type: 'request' },
    { source: 'catalog', target: 'database', type: 'data' },
    { source: 'identity', target: 'database', type: 'data' },
    { source: 'recommend', target: 'database', type: 'data' },
    { source: 'stream', target: 'database', type: 'data' },
    { source: 'recommend', target: 'catalog', type: 'request' },
    { source: 'stream', target: 'catalog', type: 'request' },
    { source: 'analytics', target: 'catalog', type: 'data' },
    { source: 'analytics', target: 'identity', type: 'data' },
    { source: 'analytics', target: 'stream', type: 'data' }
  ];
}

// Simulate service activity
function simulateServiceActivity() {
  const updates = {
    connections: []
  };
  
  // Generate random activity between services
  const services = Object.keys(serviceNodes);
  const randomSource = services[Math.floor(Math.random() * services.length)];
  let randomTarget;
  
  do {
    randomTarget = services[Math.floor(Math.random() * services.length)];
  } while (randomTarget === randomSource);
  
  updates.connections.push({
    source: randomSource,
    target: randomTarget,
    type: Math.random() > 0.5 ? 'request' : 'data',
    volume: Math.floor(Math.random() * 10) + 1
  });
  
  return updates;
}

// Simulate increased load for a service
function simulateIncreasedLoad(serviceId) {
  console.log(`Simulating increased load for ${serviceId}`);
  
  const updates = {
    connections: []
  };
  
  // Generate multiple connections to/from the service
  const services = Object.keys(serviceNodes).filter(id => id !== serviceId);
  
  for (let i = 0; i < 5; i++) {
    const randomService = services[Math.floor(Math.random() * services.length)];
    const isIncoming = Math.random() > 0.5;
    
    updates.connections.push({
      source: isIncoming ? randomService : serviceId,
      target: isIncoming ? serviceId : randomService,
      type: Math.random() > 0.3 ? 'request' : 'data',
      volume: Math.floor(Math.random() * 20) + 5
    });
  }
  
  return updates;
}

// Start server
server.listen(PORT, () => {
  console.log(`Backend services running on port ${PORT}`);
});