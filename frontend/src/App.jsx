import React, { useState, useEffect } from 'react';
import GraphVisualization from './components/GraphVisualization';
import ServiceDetails from './components/ServiceDetails';
import Header from './components/Header';
import { useWebSocket } from './hooks/useWebSocket';

function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const { isConnected, nodes, connections, simulateLoad } = useWebSocket();

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
  };

  const handleSimulateLoad = () => {
    if (selectedNode && selectedNode.id) {
      simulateLoad(selectedNode.id);
    }
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
    <div className="container mx-auto px-4 min-h-screen flex flex-col">
      <Header onSimulateLoad={handleSimulateLoad} selectedNode={selectedNode} />

      <main className="mt-6 flex-grow flex flex-col">
        <div className="graph-container bg-gray-900 rounded-lg shadow-xl border border-gray-800 flex-grow flex">
          <GraphVisualization
            nodes={nodes}
            connections={connections}
            onNodeSelect={handleNodeSelect}
          />

          {selectedNode && (
            <ServiceDetails
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
