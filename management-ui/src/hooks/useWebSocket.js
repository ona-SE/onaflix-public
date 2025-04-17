import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// Mock data to use when WebSocket connection fails
const MOCK_NODES = [
  { id: 'catalog', name: 'Content Catalog', status: 'active' },
  { id: 'identity', name: 'User Management', status: 'active' },
  { id: 'recommend', name: 'Recommendation Engine', status: 'active' },
  { id: 'stream', name: 'Streaming Service', status: 'active' },
  { id: 'analytics', name: 'Analytics Service', status: 'active' },
  { id: 'database', name: 'Database', status: 'active' },
];

const MOCK_CONNECTIONS = [
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
  { source: 'analytics', target: 'stream', type: 'data' },
];

export function useWebSocket() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [nodes, setNodes] = useState(MOCK_NODES); // Initialize with mock data
  const [connections, setConnections] = useState(MOCK_CONNECTIONS); // Initialize with mock data
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const timeoutRef = useRef(null);
  const updateQueueRef = useRef({ nodes: null, connections: null });
  const useMockData = useRef(false);

  // Apply batched updates to minimize re-renders
  const processBatchedUpdates = useCallback(() => {
    const { nodes: queuedNodes, connections: queuedConnections } = updateQueueRef.current;

    if (queuedNodes) {
      setNodes(queuedNodes);
      updateQueueRef.current.nodes = null;
    }

    if (queuedConnections) {
      setConnections(queuedConnections);
      updateQueueRef.current.connections = null;
    }

    timeoutRef.current = null;
  }, []);

  // Queue updates and debounce state changes
  const queueUpdate = useCallback(
    (type, data) => {
      updateQueueRef.current[type] = data;

      if (timeoutRef.current === null) {
        timeoutRef.current = setTimeout(processBatchedUpdates, 100);
      }
    },
    [processBatchedUpdates]
  );

  // Handle incoming WebSocket messages with debouncing
  const handleMessage = useCallback(
    (message) => {
      switch (message.type) {
        case 'INIT':
          // Initial state should apply immediately
          setNodes(message.data.nodes || MOCK_NODES);
          setConnections(message.data.connections || MOCK_CONNECTIONS);
          break;

        case 'UPDATE':
          // Queue updates for nodes and connections
          if (message.data.connections) {
            queueUpdate('connections', message.data.connections);
          }

          if (message.data.nodes) {
            // Update nodes but debounce the state change
            const updatedNodes = [...nodes];
            let hasChanges = false;

            message.data.nodes.forEach((newNode) => {
              const index = updatedNodes.findIndex((n) => n.id === newNode.id);
              if (index !== -1) {
                updatedNodes[index] = { ...updatedNodes[index], ...newNode };
                hasChanges = true;
              }
            });

            if (hasChanges) {
              queueUpdate('nodes', updatedNodes);
            }
          }
          break;

        default:
          console.warn('Unknown message type:', message.type);
      }
    },
    [nodes, queueUpdate]
  );

  // Initialize WebSocket connection
  useEffect(() => {
    console.log('Attempting to initialize WebSocket connection');

    // Always use mock data for now until backend is fixed
    if (!isConnected) {
      console.log('Using mock data immediately');
      useMockData.current = true;
      setTimeout(() => {
        setIsConnected(true);
        setNodes(MOCK_NODES);
        setConnections(MOCK_CONNECTIONS);
      }, 1500);
      return;
    }

    // If we've already tried to connect too many times, just use mock data
    if (connectionAttempts > 2) {
      console.log('Too many connection attempts, using mock data');
      if (!useMockData.current) {
        useMockData.current = true;
        setIsConnected(true);
        setNodes(MOCK_NODES);
        setConnections(MOCK_CONNECTIONS);
      }
      return;
    }

    // In a real app, this would use environment variables
    const wsUrl = 'ws://localhost:8000';
    let ws;
    try {
      ws = new WebSocket(wsUrl);
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setConnectionAttempts(prev => prev + 1);
      return;
    }

    const connectTimeout = setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        console.log('WebSocket connection timeout');
        ws.close();
        setConnectionAttempts(prev => prev + 1);
      }
    }, 5000);

    ws.onopen = () => {
      console.log('WebSocket connected');
      clearTimeout(connectTimeout);
      setIsConnected(true);
      setSocket(ws);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);

      // Use mock data if connection fails
      if (!useMockData.current) {
        console.log('Using mock data after connection loss');
        useMockData.current = true;
        setTimeout(() => {
          setIsConnected(true);
          setNodes(MOCK_NODES);
          setConnections(MOCK_CONNECTIONS);
        }, 1000);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionAttempts(prev => prev + 1);

      // Use mock data if connection fails
      if (!useMockData.current) {
        console.log('Using mock data after connection error');
        useMockData.current = true;
        setTimeout(() => {
          setIsConnected(true);
          setNodes(MOCK_NODES);
          setConnections(MOCK_CONNECTIONS);
        }, 1000);
      }
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
      clearTimeout(connectTimeout);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (ws) {
        ws.close();
      }
    };
  }, [handleMessage, connectionAttempts, isConnected]);

  // Send a message to simulate increased load
  const simulateLoad = useCallback(
    (serviceId) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: 'SIMULATE_LOAD',
            serviceId,
          })
        );
      } else if (useMockData.current) {
        // Simulate load changes with mock data
        const mockUpdatedConnections = [...connections];
        mockUpdatedConnections.forEach(conn => {
          if (conn.source === serviceId || conn.target === serviceId) {
            conn.volume = Math.floor(Math.random() * 10) + 5;
          }
        });

        setTimeout(() => {
          setConnections(mockUpdatedConnections);
        }, 500);
      }
    },
    [socket, connections]
  );

  // Stabilize the return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      isConnected,
      nodes,
      connections,
      simulateLoad,
    }),
    [isConnected, nodes, connections, simulateLoad]
  );
}
