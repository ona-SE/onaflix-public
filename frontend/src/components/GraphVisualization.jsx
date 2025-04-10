import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';

const GraphVisualization = ({ nodes, connections, onNodeSelect }) => {
  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Handle resize events
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        setDimensions({
          width: svgRef.current.parentElement.clientWidth,
          height: svgRef.current.parentElement.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

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

  // Generate fixed node positions for better control
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
        x: width * (0.3 + Math.random() * 0.4),
        y: height * (0.3 + Math.random() * 0.4),
      }
    );
  }, []);

  // Setup and update the graph visualization
  useEffect(() => {
    if (!nodes.length || !connections.length || !dimensions.width || !dimensions.height) return;
    if (isInitialized) return; // Only run once after dimensions are set

    const width = dimensions.width;
    const height = dimensions.height;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .attr('width', '100%')
      .attr('height', '100%');

    // Create a group for all visualization elements first - IMPORTANT to define 'g' before using it
    const g = svg.append('g');

    // Add zoom behavior with smoother transitions
    const zoom = d3
      .zoom()
      .scaleExtent([0.3, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    // Apply zoom after defining 'g'
    svg.call(zoom).call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1));

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
    const allNodes = [...nodes, { id: 'frontend', name: 'Frontend', status: 'active' }];

    // Add initial positions to nodes
    allNodes.forEach((node) => {
      const pos = getInitialNodePosition(node.id, width, height);
      node.x = pos.x;
      node.y = pos.y;
      // Fix positions to prevent movement
      node.fx = pos.x;
      node.fy = pos.y;
    });

    // Setup force simulation with improved parameters - but we'll stop it after initial layout
    simulationRef.current = d3
      .forceSimulation(allNodes)
      .force(
        'link',
        d3
          .forceLink(connections)
          .id((d) => d.id)
          .distance(150)
      )
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60))
      .alpha(0.3)
      .alphaDecay(0.05);

    // Create links (connections between nodes)
    const link = g
      .selectAll('.link')
      .data(connections)
      .enter()
      .append('line')
      .attr('class', (d) => `link ${d.type}`)
      .attr('stroke-width', (d) => 1 + (d.volume ? Math.min(d.volume / 5, 3) : 1))
      .attr('marker-end', (d) => `url(#arrow-${d.type})`);

    // Create link flow animations container
    const flowParticleGroup = g.append('g').attr('class', 'flow-particles');

    // Add arrow markers for links with improved styling
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

    // Create service node icons and symbols
    const serviceIcons = {
      database: (s) =>
        s
          .append('path')
          .attr(
            'd',
            'M0,-10 C7,-10 14,-8 14,-5 V5 C14,8 7,10 0,10 C-7,10 -14,8 -14,5 V-5 C-14,-8 -7,-10 0,-10 Z M0,-5 C-5,-5 -10,-7 -10,-8 S-5,-11 0,-11 S10,-9 10,-8 S5,-5 0,-5 Z'
          )
          .attr('fill', getNodeColor),
      catalog: (s) =>
        s
          .append('path')
          .attr('d', 'M-8,-8 H8 V8 H-8 Z M-5,-5 V5 H5 V-5 Z')
          .attr('fill', getNodeColor),
      identity: (s) =>
        s
          .append('path')
          .attr('d', 'M-8,-8 C-8,-12 0,-12 0,-8 C0,-12 8,-12 8,-8 V0 C8,8 -8,8 -8,0 Z')
          .attr('fill', getNodeColor),
      recommend: (s) =>
        s.append('path').attr('d', 'M0,-10 L10,7 H-10 Z').attr('fill', getNodeColor),
      stream: (s) =>
        s
          .append('path')
          .attr('d', 'M-10,-3 H10 V3 H-10 Z M-7,-10 H7 V-3 H-7 Z M-7,3 H7 V10 H-7 Z')
          .attr('fill', getNodeColor),
      analytics: (s) =>
        s
          .append('path')
          .attr('d', 'M-10,10 H-3 V-3 H-10 Z M-2,10 H5 V0 H-2 Z M6,10 H13 V-10 H6 Z')
          .attr('fill', getNodeColor),
      frontend: (s) =>
        s
          .append('path')
          .attr('d', 'M-10,-10 H10 V10 H-10 Z M-7,-7 V7 H7 V-7 Z')
          .attr('fill', getNodeColor),
    };

    // Create tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'graph-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '14px')
      .style('pointer-events', 'none')
      .style('z-index', '1000')
      .style('max-width', '200px');

    // Create nodes with enhanced styling
    const node = g
      .selectAll('.service-node')
      .data(allNodes)
      .enter()
      .append('g')
      .attr('class', (d) => `service-node ${d.id}`)
      .attr('data-id', (d) => d.id)
      .call(d3.drag().on('start', dragStarted).on('drag', dragging).on('end', dragEnded))
      .on('click', (event, d) => {
        // Toggle selection - if already selected, deselect it
        if (selectedNodeId === d.id) {
          setSelectedNodeId(null);
        } else {
          setSelectedNodeId(d.id);
        }
        event.stopPropagation();
      })
      .on('mouseover', (event, d) => {
        tooltip
          .html(
            `
          <strong>${d.name}</strong><br/>
          Status: ${d.status === 'active' ? 'Active' : 'Inactive'}<br/>
          Click for details
        `
          )
          .style('visibility', 'visible')
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`);
      })
      .on('mousemove', (event) => {
        tooltip.style('left', `${event.pageX + 10}px`).style('top', `${event.pageY - 10}px`);
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });

    // Add node backgrounds
    node
      .append('circle')
      .attr('class', 'node-bg')
      .attr('r', 20)
      .attr('fill', '#0f172a')
      .attr('stroke', (d) => (d.status === 'active' ? getNodeColor(d) : '#64748b'))
      .attr('stroke-width', 2);

    // Add service-specific icons
    node.each(function (d) {
      const iconCreator =
        serviceIcons[d.id] || ((s) => s.append('circle').attr('r', 8).attr('fill', getNodeColor));
      iconCreator(d3.select(this));
    });

    // Add pulse animation for active nodes
    node
      .filter((d) => d.status === 'active')
      .append('circle')
      .attr('r', 20)
      .attr('fill', 'none')
      .attr('stroke', (d) => getNodeColor(d))
      .attr('stroke-width', 1)
      .attr('opacity', 0.5)
      .attr('class', 'pulse-circle');

    // Add labels to nodes
    node
      .append('text')
      .attr('class', 'node-label')
      .attr('dy', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', '#e2e8f0')
      .text((d) => d.name);

    // Add status indicator
    node
      .append('circle')
      .attr('r', 4)
      .attr('cx', 14)
      .attr('cy', -14)
      .attr('fill', (d) => (d.status === 'active' ? '#10b981' : '#ef4444'));

    // Clear selection when clicking on the background
    svg.on('click', () => {
      setSelectedNodeId(null);
    });

    // Method to update selected node styles
    const updateSelectedNode = () => {
      // Reset all nodes
      node.classed('selected', false);

      // Update the selected node
      if (selectedNodeId) {
        node.filter((d) => d.id === selectedNodeId).classed('selected', true);
      }
    };

    // Watch for changes to selectedNodeId
    const selectionObserver = new MutationObserver(() => {
      updateSelectedNode();
    });

    // Apply CSS for node selection and animations
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes pulse {
        0% { opacity: 0.8; }
        50% { opacity: 0.4; }
        100% { opacity: 0; }
      }
      .pulse-circle {
        animation: pulse 2s ease-out infinite;
      }
      .flow-particle {
        animation: fadeInOut 2s ease-in-out;
      }
      .flow-particle.data {
        fill: #4f46e5;
      }
      .flow-particle.request {
        fill: #f97316;
      }
      @keyframes fadeInOut {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
      }
      .service-node {
        transition: filter 0.2s ease;
        cursor: pointer;
      }
      .service-node:hover {
        filter: brightness(1.1);
      }
      .service-node.selected {
        filter: brightness(1.2);
      }
      .service-node.selected .node-label {
        font-weight: bold;
        fill: white;
      }
      .service-node.selected .node-bg {
        stroke-width: 2;
      }
      .service-node .node-bg {
        transition: stroke-width 0.2s ease;
      }
    `;
    document.head.appendChild(style);

    // Drag functions
    function dragStarted(event, d) {
      // Don't actually restart the simulation during drag
      // We're using static positions
      event.sourceEvent.stopPropagation();
    }

    function dragging(event, d) {
      // Update position manually, no simulation forces
      d.x = event.x;
      d.y = event.y;
      d.fx = event.x;
      d.fy = event.y;

      // Update the visual elements
      d3.select(this).attr('transform', `translate(${event.x},${event.y})`);

      // Update connected links
      link.each(function (l) {
        if (l.source.id === d.id) {
          d3.select(this).attr('x1', d.x).attr('y1', d.y);
        }
        if (l.target.id === d.id) {
          d3.select(this).attr('x2', d.x).attr('y2', d.y);
        }
      });
    }

    function dragEnded(event, d) {
      // Keep the position fixed, no simulation
    }

    // Initial positions
    simulationRef.current.tick(100); // Run some ticks to get initial positions

    // Update positions once
    updatePositions();

    // Then stop the simulation completely
    simulationRef.current.stop();

    // Initialize selected node if there's one passed in props
    updateSelectedNode();

    // Update static positions
    function updatePositions() {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    }

    // Add periodic connection animation but not full re-rendering
    let animationInterval = setInterval(() => {
      animateFlowParticles();
    }, 3000);

    // Animate data flow between nodes with improved particles
    function animateFlowParticles() {
      // Remove existing particles
      flowParticleGroup.selectAll('.flow-particle').remove();

      // Create new particles with improved visual appearance
      connections.forEach((connection) => {
        if (!connection.source.x || !connection.target.x) return;

        // Only create particles for active connections
        if (Math.random() < 0.4) {
          const particleCount = connection.volume || 1;
          const maxParticles = Math.min(particleCount, 3);

          for (let i = 0; i < maxParticles; i++) {
            // Calculate position along the path
            const position = Math.random();
            const x = connection.source.x + (connection.target.x - connection.source.x) * position;
            const y = connection.source.y + (connection.target.y - connection.source.y) * position;

            // Calculate particle size based on volume
            const size = 1.5 + (connection.volume ? Math.min(connection.volume / 15, 2) : 0.5);

            // Add particle
            flowParticleGroup
              .append('circle')
              .attr('class', `flow-particle ${connection.type}`)
              .attr('cx', x)
              .attr('cy', y)
              .attr('r', size)
              .attr('opacity', Math.random() * 0.5 + 0.5);
          }
        }
      });
    }

    // Mark as initialized to prevent re-rendering
    setIsInitialized(true);

    // Cleanup
    return () => {
      tooltip.remove();
      clearInterval(animationInterval);
      selectionObserver.disconnect();
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [
    nodes,
    connections,
    onNodeSelect,
    dimensions,
    isInitialized,
    getInitialNodePosition,
    selectedNodeId,
  ]);

  // When selectedNodeId changes, update the node appearance
  useEffect(() => {
    if (!isInitialized) return;

    const svg = d3.select(svgRef.current);
    const nodes = svg.selectAll('.service-node');

    // Remove selected class from all nodes
    nodes.classed('selected', false);

    // Add selected class to the selected node
    if (selectedNodeId) {
      nodes.filter((d) => d.id === selectedNodeId).classed('selected', true);
    }
  }, [selectedNodeId, isInitialized]);

  // Handle updates when nodes/connections change without full re-rendering
  useEffect(() => {
    if (!isInitialized || !simulationRef.current) return;

    // Only update the data references, not the positions
    simulationRef.current.nodes(nodes);
    simulationRef.current.force('link').links(connections);

    // But don't restart the simulation - we want static positions
  }, [nodes, connections, isInitialized]);

  return <svg ref={svgRef} className="graph-visualization"></svg>;
};

export default GraphVisualization;
