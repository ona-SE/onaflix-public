import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';

const GraphVisualization = React.memo(({ nodes, connections, onNodeSelect }) => {
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const simulationRef = useRef(null);
  const nodesRef = useRef([]); // Store nodes in ref to prevent re-renders
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Debounce resize events
  const updateDimensions = useCallback(() => {
    if (svgRef.current?.parentElement) {
      setDimensions({
        width: svgRef.current.parentElement.clientWidth,
        height: svgRef.current.parentElement.clientHeight,
      });
    }
  }, []);

  // Handle resize events with debounce
  useEffect(() => {
    updateDimensions();

    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimensions, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [updateDimensions]);

  // When selectedNodeId changes, find the node and pass it to parent
  useEffect(() => {
    if (selectedNodeId && nodes.length) {
      const node =
        nodes.find((n) => n.id === selectedNodeId) ||
        (selectedNodeId === 'frontend'
          ? { id: 'frontend', name: 'Frontend', status: 'active' }
          : null);
      if (node) {
        onNodeSelect(node);
      }
    } else if (selectedNodeId === null) {
      onNodeSelect(null);
    }
  }, [selectedNodeId, nodes, onNodeSelect]);

  // Generate fixed node positions for better control - memoized
  const getInitialNodePosition = useCallback((id, width, height) => {
    // Predefined positions for known nodes
    const positions = {
      frontend: { x: width * 0.25, y: height * 0.5 },
      catalog: { x: width * 0.65, y: height * 0.7 },
      identity: { x: width * 0.5, y: height * 0.2 },
      recommend: { x: width * 0.5, y: height * 0.6 },
      stream: { x: width * 0.75, y: height * 0.5 },
      analytics: { x: width * 0.75, y: height * 0.3 },
      database: { x: width * 0.5, y: height * 0.45 },
    };

    return (
      positions[id] || {
        x: width * (0.3 + (0.4 * (id.charCodeAt(0) % 5)) / 5),
        y: height * (0.3 + (0.4 * (id.charCodeAt(1) % 5)) / 5),
      }
    );
  }, []);

  // Node click handler - memoized
  const handleNodeClick = useCallback((node) => {
    setSelectedNodeId((prevId) => (prevId === node.id ? null : node.id));
  }, []);

  // Setup drag behavior only once - memoized
  const setupDrag = useCallback(() => {
    return d3
      .drag()
      .on('start', (event, d) => {
        if (!event.active) simulationRef.current?.alphaTarget(0.01).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;

        // Update positions without re-simulation
        d3.select(event.sourceEvent.target.parentNode).attr(
          'transform',
          `translate(${event.x}, ${event.y})`
        );

        // Update connected links
        if (gRef.current) {
          d3.select(gRef.current)
            .selectAll('.link')
            .filter((link) => link.source.id === d.id || link.target.id === d.id)
            .attr('x1', (link) => (link.source.id === d.id ? d.x : link.source.x))
            .attr('y1', (link) => (link.source.id === d.id ? d.y : link.source.y))
            .attr('x2', (link) => (link.target.id === d.id ? d.x : link.target.x))
            .attr('y2', (link) => (link.target.id === d.id ? d.y : link.target.y));
        }
      })
      .on('end', (event, d) => {
        if (!event.active) simulationRef.current?.alphaTarget(0);
        // Don't reset fx/fy to allow nodes to stay in place after dragging
      });
  }, []);

  // Add a force-reinitialize effect if nodes and dimensions are available but graph isn't initialized
  useEffect(() => {
    if (
      !isInitialized &&
      nodes.length &&
      connections.length &&
      dimensions.width &&
      dimensions.height
    ) {
      console.log('Force reinitializing graph');
      setIsInitialized(false);

      // Clean up any existing SVG elements
      if (svgRef.current) {
        d3.select(svgRef.current).selectAll('*').remove();
      }

      // Queue reinitialization in next tick
      setTimeout(() => {
        updateDimensions();
      }, 0);
    }
  }, [nodes, connections, dimensions, isInitialized, updateDimensions]);

  // Setup and update the graph visualization only when dimensions change or first render
  useEffect(() => {
    if (!nodes.length || !connections.length || !dimensions.width || !dimensions.height) {
      console.log('Missing data for graph initialization:', {
        nodesLength: nodes.length,
        connectionsLength: connections.length,
        width: dimensions.width,
        height: dimensions.height,
      });
      return;
    }

    if (isInitialized) {
      console.log('Graph already initialized, skipping');
      return;
    }

    console.log('Initializing graph visualization with dimensions:', dimensions);

    const width = dimensions.width;
    const height = dimensions.height;

    // Store current nodes
    nodesRef.current = [...nodes, { id: 'frontend', name: 'Frontend', status: 'active' }];

    try {
      // Clear previous SVG content
      d3.select(svgRef.current).selectAll('*').remove();

      const svg = d3
        .select(svgRef.current)
        .attr('viewBox', [0, 0, width, height])
        .attr('width', '100%')
        .attr('height', '100%')
        .style('background', 'rgba(0, 0, 0, 0.05)'); // Add visible background for debugging

      // Create a group for all visualization elements
      const g = svg.append('g');
      gRef.current = g.node();

      // Add zoom behavior with smoother transitions
      const zoom = d3
        .zoom()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });

      // Apply zoom
      svg.call(zoom).call(zoom.transform, d3.zoomIdentity).on('dblclick.zoom', null); // Disable double-click zoom

      // Add background grid
      const gridSize = 40;
      const gridGroup = g.append('g').attr('class', 'grid');

      for (let x = 0; x < width; x += gridSize) {
        gridGroup
          .append('line')
          .attr('x1', x)
          .attr('y1', 0)
          .attr('x2', x)
          .attr('y2', height)
          .attr('stroke', '#2a2a3a')
          .attr('stroke-width', 0.5);
      }

      for (let y = 0; y < height; y += gridSize) {
        gridGroup
          .append('line')
          .attr('x1', 0)
          .attr('y1', y)
          .attr('x2', width)
          .attr('y2', y)
          .attr('stroke', '#2a2a3a')
          .attr('stroke-width', 0.5);
      }

      // Add a frontend node if it doesn't exist
      const allNodes = [...nodesRef.current];

      // Debug nodes
      console.log('Nodes to render:', allNodes);

      // Add initial positions to nodes
      allNodes.forEach((node) => {
        const pos = getInitialNodePosition(node.id, width, height);
        node.x = pos.x;
        node.y = pos.y;
        // Set positions without fixing them
        node.initialX = pos.x;
        node.initialY = pos.y;
      });

      // Add arrow markers for links
      svg
        .append('defs')
        .selectAll('marker')
        .data(['request', 'data'])
        .enter()
        .append('marker')
        .attr('id', (d) => `arrow-${d}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 22)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('class', (d) => d);

      // Process connections to ensure they reference valid nodes
      const validConnections = connections.filter((conn) => {
        const sourceNode = allNodes.find((n) => n.id === conn.source);
        const targetNode = allNodes.find((n) => n.id === conn.target);
        return sourceNode && targetNode;
      });

      // Debug connections
      console.log('Valid connections to render:', validConnections);

      // Create links (connections between nodes)
      const link = g
        .selectAll('.link')
        .data(validConnections)
        .enter()
        .append('line')
        .attr('class', (d) => `link ${d.type}`)
        .attr('stroke-width', (d) => 1 + (d.volume ? Math.min(d.volume / 5, 3) : 1))
        .attr('marker-end', (d) => `url(#arrow-${d.type})`)
        .attr('x1', (d) => {
          const node = allNodes.find((n) => n.id === d.source);
          return node ? node.x : 0;
        })
        .attr('y1', (d) => {
          const node = allNodes.find((n) => n.id === d.source);
          return node ? node.y : 0;
        })
        .attr('x2', (d) => {
          const node = allNodes.find((n) => n.id === d.target);
          return node ? node.x : 0;
        })
        .attr('y2', (d) => {
          const node = allNodes.find((n) => n.id === d.target);
          return node ? node.y : 0;
        });

      // Use a more stable node creation approach
      const nodeGroups = g
        .selectAll('.service-node-group')
        .data(allNodes)
        .enter()
        .append('g')
        .attr('class', (d) => `service-node-group ${d.id}`)
        .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
        .call(setupDrag());

      // Add node circles
      nodeGroups
        .append('circle')
        .attr('r', 20)
        .attr('class', (d) => `node-circle ${d.status || 'active'}`)
        .attr('fill', (d) => getNodeColor(d))
        .on('click', (event, d) => {
          event.stopPropagation();
          handleNodeClick(d);
        });

      // Add node labels
      nodeGroups
        .append('text')
        .attr('class', 'node-label')
        .attr('dy', 30)
        .attr('text-anchor', 'middle')
        .text((d) => d.name || d.id);

      // Skip simulation to reduce shakiness - just place nodes at their initial positions
      console.log('Graph initialization complete');
      setIsInitialized(true);

      // Handle svg background clicks to deselect
      svg.on('click', () => {
        setSelectedNodeId(null);
      });
    } catch (error) {
      console.error('Error initializing graph:', error);
    }

    return () => {
      // Cleanup to prevent memory leaks
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [
    dimensions,
    isInitialized,
    nodes,
    connections,
    getInitialNodePosition,
    handleNodeClick,
    setupDrag,
  ]);

  // Add a separate effect to update node positions when data changes without full re-initialization
  useEffect(() => {
    if (!isInitialized || !svgRef.current) return;

    // Update current nodes in the ref without causing re-renders
    nodesRef.current = [...nodes, { id: 'frontend', name: 'Frontend', status: 'active' }];

    // Don't redraw everything, just update existing elements
    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);

    // Update node positions if they exist
    const nodeGroups = g.selectAll('.service-node-group');
    nodeGroups
      .data(nodesRef.current, (d) => d.id)
      .attr('class', (d) => `service-node-group ${d.id}`);

    // Update link data
    const links = g.selectAll('.link');
    links
      .data(connections, (d) => `${d.source}-${d.target}`)
      .attr('class', (d) => `link ${d.type}`)
      .attr('stroke-width', (d) => 1 + (d.volume ? Math.min(d.volume / 5, 3) : 1));
  }, [nodes, connections, isInitialized]);

  return <svg ref={svgRef} className="graph-visualization" width="100%" height="100%" />;
});

// Generate node color based on service type
function getNodeColor(d) {
  const colors = {
    catalog: '#4f46e5', // primary
    identity: '#10b981', // secondary
    recommend: '#f97316', // accent
    stream: '#f59e0b', // warning
    analytics: '#ef4444', // danger
    database: '#9333ea', // purple
    frontend: '#0ea5e9', // blue
  };

  return colors[d.id] || '#6b7280';
}

export default GraphVisualization;
