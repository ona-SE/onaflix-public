import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GraphVisualization = ({ nodes, connections }) => {
  const svgRef = useRef(null);
  const gRef = useRef(null);

  // Function to create a hexagon path
  const createHexagonPath = (size) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * 2 * Math.PI) / 6;
      points.push([
        size * Math.cos(angle),
        size * Math.sin(angle)
      ]);
    }
    return d3.line()(points) + 'Z';
  };

  // Function to create a database stack icon
  const createDatabaseIcon = (size) => {
    const height = size * 1.5;
    const width = size * 1.2;
    const curveHeight = size * 0.3;
    
    const path = [
      `M ${-width/2} ${-height/2}`,
      `L ${width/2} ${-height/2}`,
      `Q ${width/2 + curveHeight} ${-height/2} ${width/2 + curveHeight} ${-height/2 + curveHeight}`,
      `L ${width/2 + curveHeight} ${height/2 - curveHeight}`,
      `Q ${width/2 + curveHeight} ${height/2} ${width/2} ${height/2}`,
      `L ${-width/2} ${height/2}`,
      `Q ${-width/2 - curveHeight} ${height/2} ${-width/2 - curveHeight} ${height/2 - curveHeight}`,
      `L ${-width/2 - curveHeight} ${-height/2 + curveHeight}`,
      `Q ${-width/2 - curveHeight} ${-height/2} ${-width/2} ${-height/2}`,
      'Z'
    ].join(' ');

    return path;
  };

  // Function to create a frontend icon (browser-like shape)
  const createFrontendIcon = (size) => {
    const width = size * 1.5;
    const height = size * 1.2;
    const cornerRadius = size * 0.2;
    
    const path = [
      // Top bar
      `M ${-width/2} ${-height/2}`,
      `L ${width/2} ${-height/2}`,
      // Right side
      `L ${width/2} ${height/2 - cornerRadius}`,
      `Q ${width/2} ${height/2} ${width/2 - cornerRadius} ${height/2}`,
      // Bottom
      `L ${-width/2 + cornerRadius} ${height/2}`,
      `Q ${-width/2} ${height/2} ${-width/2} ${height/2 - cornerRadius}`,
      // Left side
      `L ${-width/2} ${-height/2}`,
      'Z',
      // Browser controls
      `M ${-width/2 + size*0.2} ${-height/2 + size*0.2}`,
      `a ${size*0.1} ${size*0.1} 0 1 1 ${size*0.2} 0`,
      `a ${size*0.1} ${size*0.1} 0 1 1 ${-size*0.2} 0`,
      `M ${-width/2 + size*0.5} ${-height/2 + size*0.2}`,
      `a ${size*0.1} ${size*0.1} 0 1 1 ${size*0.2} 0`,
      `a ${size*0.1} ${size*0.1} 0 1 1 ${-size*0.2} 0`,
      `M ${-width/2 + size*0.8} ${-height/2 + size*0.2}`,
      `a ${size*0.1} ${size*0.1} 0 1 1 ${size*0.2} 0`,
      `a ${size*0.1} ${size*0.1} 0 1 1 ${-size*0.2} 0`
    ].join(' ');

    return path;
  };

  useEffect(() => {
    if (!nodes.length || !connections.length) return;

    const width = svgRef.current.parentElement.clientWidth;
    const height = svgRef.current.parentElement.clientHeight;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .attr('width', '100%')
      .attr('height', '100%');

    // Create a group for all visualization elements
    const g = svg.append('g');
    gRef.current = g.node();

    // Add zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom).call(zoom.transform, d3.zoomIdentity);

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
      .attr('fill', (d) => (d === 'request' ? '#4ade80' : '#60a5fa'));

    // Create a force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force('link', d3.forceLink(connections).id((d) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    // Draw links
    const link = g
      .append('g')
      .selectAll('line')
      .data(connections)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', (d) => (d.type === 'request' ? '#4ade80' : '#60a5fa'))
      .attr('stroke-width', 2)
      .attr('marker-end', (d) => `url(#arrow-${d.type})`);

    // Draw nodes
    const node = g
      .append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add shapes to nodes
    node.each(function(d) {
      const nodeGroup = d3.select(this);
      
      if (d.id === 'database') {
        // Create database stack icon
        nodeGroup
          .append('path')
          .attr('d', createDatabaseIcon(20))
          .attr('fill', '#3b82f6')
          .attr('stroke', '#1e40af')
          .attr('stroke-width', 2);
      } else if (d.id === 'frontend') {
        // Create frontend browser icon
        nodeGroup
          .append('path')
          .attr('d', createFrontendIcon(20))
          .attr('fill', '#10b981')
          .attr('stroke', '#059669')
          .attr('stroke-width', 2);
      } else {
        // Create hexagon for services
        nodeGroup
          .append('path')
          .attr('d', createHexagonPath(20))
          .attr('fill', '#3b82f6')
          .attr('stroke', '#1e40af')
          .attr('stroke-width', 2);
      }

      // Add text labels to nodes
      nodeGroup
        .append('text')
        .attr('dy', 30)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text((d) => d.name)
        .style('font-size', '12px')
        .style('pointer-events', 'none');
    });

    // Update positions on each tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  }, [nodes, connections]);

  return <svg ref={svgRef} className="w-full h-full" />;
};

export default GraphVisualization;
