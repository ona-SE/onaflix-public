import React from 'react';
import Header from './components/Header';
import GraphVisualization from './components/GraphVisualization';
import './App.css';

// Define static nodes and connections
const staticNodes = [
  { id: 'frontend', name: 'Frontend' },
  { id: 'catalog', name: 'Catalog' },
  { id: 'identity', name: 'Identity' },
  { id: 'recommend', name: 'Recommend' },
  { id: 'stream', name: 'Stream' },
  { id: 'analytics', name: 'Analytics' },
  { id: 'database', name: 'Database' }
];

const staticConnections = [
  // Frontend connections
  { source: 'frontend', target: 'catalog', type: 'request' },
  { source: 'frontend', target: 'identity', type: 'request' },
  { source: 'frontend', target: 'recommend', type: 'request' },
  { source: 'frontend', target: 'stream', type: 'request' },
  { source: 'frontend', target: 'analytics', type: 'data' },
  // Service connections
  { source: 'catalog', target: 'database', type: 'data' },
  { source: 'identity', target: 'database', type: 'data' },
  { source: 'recommend', target: 'database', type: 'data' },
  { source: 'stream', target: 'database', type: 'data' },
  { source: 'analytics', target: 'database', type: 'data' }
];

function App() {
  return (
    <div className="app">
      <Header />
      <div className="canvas-container">
        <GraphVisualization nodes={staticNodes} connections={staticConnections} />
      </div>
    </div>
  );
}

export default App;
