import { useState, useEffect, useCallback } from 'react';

export function useWebSocket() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);

  // Initialize WebSocket connection
  useEffect(() => {
    // In a real app, this would use environment variables
    const wsUrl = 'ws://localhost:8000';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setSocket(ws);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      // Attempt to reconnect after a delay
      setTimeout(() => {
        setSocket(null);
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  // Handle incoming WebSocket messages
  const handleMessage = useCallback((message) => {
    switch (message.type) {
      case 'INIT':
        // Initial state with nodes and connections
        setNodes(message.data.nodes || []);
        setConnections(message.data.connections || []);
        break;
        
      case 'UPDATE':
        // Update connections or nodes
        if (message.data.connections) {
          setConnections(prev => {
            // In a real app, we would merge with existing connections
            // For demo, we'll just use the new connections
            return message.data.connections;
          });
        }
        if (message.data.nodes) {
          setNodes(prev => {
            // Update existing nodes with new data
            const updatedNodes = [...prev];
            message.data.nodes.forEach(newNode => {
              const index = updatedNodes.findIndex(n => n.id === newNode.id);
              if (index !== -1) {
                updatedNodes[index] = { ...updatedNodes[index], ...newNode };
              }
            });
            return updatedNodes;
          });
        }
        break;
        
      default:
        console.warn('Unknown message type:', message.type);
    }
  }, []);

  // Send a message to simulate increased load
  const simulateLoad = useCallback((serviceId) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'SIMULATE_LOAD',
        serviceId
      }));
    }
  }, [socket]);

  return {
    isConnected,
    nodes,
    connections,
    simulateLoad
  };
}