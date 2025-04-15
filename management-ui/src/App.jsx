import React, { useState } from 'react';
import GraphVisualization from './components/GraphVisualization';
import Header from './components/Header';
import './styles.css';

// Define static service nodes
const staticNodes = [
  { id: 'frontend', name: 'Frontend', status: 'active' },
  { id: 'catalog', name: 'Catalog', status: 'active' },
  { id: 'identity', name: 'Identity', status: 'active' },
  { id: 'recommend', name: 'Recommend', status: 'active' },
  { id: 'stream', name: 'Stream', status: 'active' },
  { id: 'analytics', name: 'Analytics', status: 'active' },
  { id: 'database', name: 'Database', status: 'active' },
];

// Define static connections between services
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
  { source: 'recommend', target: 'catalog', type: 'request' },
  { source: 'stream', target: 'catalog', type: 'request' },
  { source: 'analytics', target: 'stream', type: 'data' },
  { source: 'analytics', target: 'recommend', type: 'data' },
];

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className="container mx-auto px-4 min-h-screen flex flex-col relative">
      <Header onToggleTheme={handleToggleTheme} isDarkMode={isDarkMode} />

      <main className="mt-6 flex-grow flex flex-col">
        <div className="graph-container bg-gray-900 rounded-lg shadow-xl border border-gray-800 flex-grow flex">
          <GraphVisualization
            nodes={staticNodes}
            connections={staticConnections}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
