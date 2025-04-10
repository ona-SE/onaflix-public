import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GraphVisualization = ({ nodes, connections, onNodeSelect }) => {
  const svgRef = useRef(null);
  const simulationRef = useRef(null);

  // Setup and update the graph visualization
  useEffect(() => {
    if (!nodes.length || !connections.length) return;

    // Get the actual dimensions of the parent container
    const width = svgRef.current.parentElement.clientWidth;
    const height = svgRef.current.parentElement.clientHeight;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .attr('width', '100%')
      .attr('height', '100%');

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create a group for all visualization elements
    const g = svg.append('g');

    // Add a frontend node if it doesn't exist
    const allNodes = [
      ...nodes,
      { id: 'frontend', name: 'Frontend', status: 'active' }
    ];

    // Setup force simulation
    simulationRef.current = d3.forceSimulation(allNodes)
      .force('link', d3.forceLink(connections)
        .id(d => d.id)
        .distance(120))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    // Create links (connections between nodes)
    const link = g.selectAll('.link')
      .data(connections)
      .enter().append('line')
      .attr('class', d => `link ${d.type}`)
      .attr('marker-end', d => `url(#arrow-${d.type})`);

    // Create link flow animations
    const flowParticleGroup = g.append('g')
      .attr('class', 'flow-particles');

    // Add arrow markers for links
    svg.append('defs').selectAll('marker')
      .data(['request', 'data'])
      .enter().append('marker')
      .attr('id', d => `arrow-${d}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('class', d => d);

    // Create nodes
    const node = g.selectAll('.service-node')
      .data(allNodes)
      .enter().append('g')
      .attr('class', d => `service-node ${d.id}`)
      .call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragging)
        .on('end', dragEnded))
      .on('click', (event, d) => {
        onNodeSelect(d);
        event.stopPropagation();
      });

    // Clear selection when clicking on the background
    svg.on('click', () => {
      onNodeSelect(null);
    });

    // Add circles to nodes
    node.append('circle')
      .attr('r', d => d.id === 'database' ? 25 : 20)
      .attr('fill', getNodeColor);

    // Add labels to nodes
    node.append('text')
      .attr('class', 'node-label')
      .attr('dy', 30)
      .text(d => d.name);

    // Add status indicator
    node.append('circle')
      .attr('r', 5)
      .attr('cx', 15)
      .attr('cy', -15)
      .attr('fill', d => d.status === 'active' ? '#10b981' : '#ef4444');

    // Update positions on each tick of the simulation
    simulationRef.current.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);

      // Animate flow particles
      animateFlowParticles();
    });

    // Drag functions
    function dragStarted(event, d) {
      if (!event.active) simulationRef.current.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragging(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event, d) {
      if (!event.active) simulationRef.current.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Generate node color based on service type
    function getNodeColor(d) {
      const colors = {
        catalog: '#4f46e5',    // primary
        identity: '#10b981',   // secondary
        recommend: '#f97316',  // accent
        stream: '#f59e0b',     // warning
        analytics: '#ef4444',  // danger
        database: '#9333ea',   // purple
        frontend: '#0ea5e9'    // blue
      };

      return colors[d.id] || '#6b7280';
    }

    // Animate data flow between nodes
    function animateFlowParticles() {
      // Remove existing particles
      flowParticleGroup.selectAll('.flow-particle').remove();

      // Create new particles
      connections.forEach(connection => {
        if (!connection.source.x || !connection.target.x) return;

        // Only create particles for some connections to avoid overloading
        if (Math.random() < 0.3) {
          const particleCount = connection.volume || 1;

          for (let i = 0; i < particleCount; i++) {
            // Calculate position along the path
            const position = Math.random();
            const x = connection.source.x + (connection.target.x - connection.source.x) * position;
            const y = connection.source.y + (connection.target.y - connection.source.y) * position;

            // Add particle
            flowParticleGroup.append('circle')
              .attr('class', `flow-particle ${connection.type}`)
              .attr('cx', x)
              .attr('cy', y)
              .attr('r', 2 + Math.random() * 2);
          }
        }
      });
    }
  }, [nodes, connections, onNodeSelect]);

  return (
    <svg ref={svgRef} className="graph-container"></svg>
  );
};

export default GraphVisualization;