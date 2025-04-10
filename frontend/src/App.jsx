import React, { useState, useEffect, useCallback, useMemo } from 'react';
import GraphVisualization from './components/GraphVisualization';
import ServiceDetails from './components/ServiceDetails';
import Header from './components/Header';
import ServiceControls from './components/ServiceControls';
import { useWebSocket } from './hooks/useWebSocket';

// Define a type for the node structure to help with type checking
/**
 * @typedef {Object} ServiceNode
 * @property {string} id - The service identifier
 * @property {string} name - The display name of the service
 * @property {string} status - The service status (active/inactive)
 */

function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedServiceButton, setSelectedServiceButton] = useState(null);
  const [appState, setAppState] = useState('initializing'); // 'initializing', 'connecting', 'ready', 'error'
  const { isConnected, nodes, connections, simulateLoad } = useWebSocket();

  // Handle app state changes
  useEffect(() => {
    if (!isConnected) {
      setAppState('connecting');
    } else if (nodes.length === 0 || connections.length === 0) {
      setAppState('error');
    } else {
      setAppState('ready');
    }
  }, [isConnected, nodes, connections]);

  // Handle node selection with a stable reference
  const handleNodeSelect = useCallback((node) => {
    setSelectedNode(node);
    if (node) {
      setSelectedServiceButton(node.id);
    }
  }, []);

  // Memoize simulateLoadWithFeedback to prevent recreating on every render
  const simulateLoadWithFeedback = useCallback((serviceId) => {
    if (!serviceId) return;

    setIsLoading(true);
    simulateLoad(serviceId);

    // Simulate a loading state for visual feedback
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [simulateLoad]);

  // Memoize the handleSimulateLoad function
  const handleSimulateLoad = useCallback(() => {
    if (selectedNode) {
      simulateLoadWithFeedback(selectedNode.id);
    }
  }, [selectedNode, simulateLoadWithFeedback]);

  // Memoize the handleToggleTheme function
  const handleToggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  // Memoize the handleSelectService function
  const handleSelectService = useCallback((serviceId) => {
    setSelectedServiceButton(serviceId);

    // Find the service node
    const serviceNode = nodes.find((node) => node.id === serviceId);
    if (serviceNode) {
      setSelectedNode(serviceNode);
    }
  }, [nodes]);

  // Listen for custom simulate-load events from child components
  useEffect(() => {
    const handleSimulateLoadEvent = (event) => {
      const serviceId = event.detail;
      console.log(`Simulating load on service: ${serviceId}`);
      simulateLoadWithFeedback(serviceId);
    };

    window.addEventListener('simulate-load', handleSimulateLoadEvent);
    return () => {
      window.removeEventListener('simulate-load', handleSimulateLoadEvent);
    };
  }, [simulateLoadWithFeedback]);

  // Handle theme toggle
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  // Memoize nodes and connections to prevent unnecessary rerenders
  const memoizedNodes = useMemo(() => nodes || [], [nodes]);
  const memoizedConnections = useMemo(() => connections || [], [connections]);

  // Set initial selected service from nodes when they load
  useEffect(() => {
    if (nodes && nodes.length > 0 && !selectedNode) {
      console.log("Setting initial selected node");
      // Find analytics node to select by default
      const analyticsNode = nodes.find((node) => node.id === 'analytics');
      if (analyticsNode) {
        setSelectedNode(analyticsNode);
        setSelectedServiceButton('analytics');
      } else if (nodes[0]) {
        // Fallback to first node
        setSelectedNode(nodes[0]);
        setSelectedServiceButton(nodes[0].id);
      }
    }
  }, [nodes, selectedNode]);

  // Display loading state during connection
  if (appState === 'connecting') {
    return (
      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
        <div className="loading">
          <div className="spinner"></div>
          <p>Connecting to streaming platform services...</p>
        </div>
      </div>
    );
  }

  // Display error state if data failed to load
  if (appState === 'error') {
    return (
      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
        <div className="error-state text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
          <p className="mb-4">We couldn't load the service data. Please try refreshing the page.</p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 min-h-screen flex flex-col relative">
      <Header
        onSimulateLoad={handleSimulateLoad}
        selectedNode={selectedNode}
        onToggleTheme={handleToggleTheme}
        isDarkMode={isDarkMode}
      />

      <main className="mt-6 flex-grow flex flex-col">
        <div className="graph-container bg-gray-900 rounded-lg shadow-xl border border-gray-800 flex-grow flex">
          <GraphVisualization
            nodes={memoizedNodes}
            connections={memoizedConnections}
            onNodeSelect={handleNodeSelect}
          />

          {selectedNode && (
            <ServiceDetails node={selectedNode} onClose={() => setSelectedNode(null)} />
          )}

          <ServiceControls
            selectedService={selectedServiceButton}
            onSelectService={handleSelectService}
            onToggleTheme={handleToggleTheme}
            isDarkMode={isDarkMode}
          />
        </div>
      </main>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl flex items-center">
            <div className="spinner mr-4"></div>
            <p className="text-white">Simulating load on {selectedNode?.name || 'service'}...</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .load-notification {
          position: fixed;
          bottom: 20px;
          right: 20px;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1000;
        }
      `}</style>
    </div>
  );
}

export default App;
