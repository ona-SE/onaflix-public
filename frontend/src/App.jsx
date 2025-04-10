import React, { useState, useEffect } from 'react';
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
  const { isConnected, nodes, connections, simulateLoad } = useWebSocket();

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
  }, [simulateLoad]);

  // Handle theme toggle
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  // Set initial selected service from nodes when they load
  useEffect(() => {
    if (nodes && nodes.length > 0 && !selectedNode) {
      // Find analytics node to select by default
      const analyticsNode = nodes.find((node) => node.id === 'analytics');
      if (analyticsNode) {
        setSelectedNode(analyticsNode);
        setSelectedServiceButton('analytics');
      }
    }
  }, [nodes, selectedNode]);

  /**
   * Handle node selection
   * @param {ServiceNode|null} node - The selected service node
   */
  const handleNodeSelect = (node) => {
    setSelectedNode(node);
    if (node) {
      setSelectedServiceButton(node.id);
    }
  };

  const handleSimulateLoad = () => {
    if (selectedNode && selectedNode.id) {
      simulateLoadWithFeedback(selectedNode.id);
    }
  };

  const handleToggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleSelectService = (serviceId) => {
    setSelectedServiceButton(serviceId);
    // Find the corresponding node to select
    const node = nodes.find((n) => n.id === serviceId);

    if (node) {
      setSelectedNode(node);
    }
  };

  // Add feedback for simulation
  const simulateLoadWithFeedback = (serviceId) => {
    setIsLoading(true);

    // Show loading state for a second
    setTimeout(() => {
      // Call the actual simulation
      simulateLoad(serviceId);
      setIsLoading(false);

      // Show success notification
      showNotification(`Simulated load on ${serviceId} service`);
    }, 1000);
  };

  // Simple notification system
  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'load-notification';
    notification.innerHTML = `
      <div class="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        ${message}
      </div>
    `;

    document.body.appendChild(notification);

    // Fade in
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
        <div className="loading">
          <div className="spinner"></div>
          <p>Connecting to streaming platform services...</p>
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
            nodes={nodes}
            connections={connections}
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
