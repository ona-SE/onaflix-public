import React, { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';

const GraphVisualization = React.memo(({ nodes, connections, onNodeClick }) => {
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const simulationRef = useRef(null);

  // Function to create a hexagon path
  const createHexagonPath = useCallback((size) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * 2 * Math.PI) / 6;
      points.push([
        size * Math.cos(angle),
        size * Math.sin(angle)
      ]);
    }
    return d3.line()(points) + 'Z';
  }, []);

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

    const width = svgRef.current?.parentElement?.clientWidth;
    const height = svgRef.current?.parentElement?.clientHeight;

    // Return early if dimensions aren't available
    if (!width || !height) return;

    // Only clear and recreate if the simulation doesn't exist
    if (!simulationRef.current) {
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

      try {
        // Set initial zoom level to 1.2x
        svg.call(zoom).call(zoom.transform, d3.zoomIdentity.scale(1.2));
      } catch (error) {
        // Silently fail in test environment
        if (process.env.NODE_ENV !== 'test') {
          console.error('Failed to initialize zoom:', error);
        }
      }

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

      // Add Platform VPC rectangle
      const platformVPC = g.append('rect')
        .attr('x', width * 0.1)
        .attr('y', height * 0.1)
        .attr('width', width * 0.8)
        .attr('height', height * 0.8)
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('fill', 'rgba(30, 41, 59, 0.1)')
        .attr('stroke', 'rgba(255, 255, 255, 0.2)')
        .attr('stroke-width', 2);

      // Add Platform VPC label
      g.append('text')
        .attr('x', width * 0.5)
        .attr('y', height * 0.12)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .style('font-size', '16px')
        .text('Platform VPC');

      // Add Gitpod Runner rectangle
      const gitpodRunner = g.append('rect')
        .attr('x', width * 0.2)
        .attr('y', height * 0.2)
        .attr('width', width * 0.6)
        .attr('height', height * 0.6)
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('fill', 'rgba(30, 41, 59, 0.2)')
        .attr('stroke', 'rgba(255, 255, 255, 0.3)')
        .attr('stroke-width', 2);

      // Add Gitpod Runner label
      g.append('text')
        .attr('x', width * 0.5)
        .attr('y', height * 0.22)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .style('font-size', '14px')
        .text('Gitpod Runner');

      // Add My Environment rectangle
      const myEnvironment = g.append('rect')
        .attr('x', width * 0.3)
        .attr('y', height * 0.3)
        .attr('width', width * 0.4)
        .attr('height', height * 0.4)
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('fill', 'rgba(30, 41, 59, 0.3)')
        .attr('stroke', 'rgba(255, 255, 255, 0.4)')
        .attr('stroke-width', 2);

      // Add My Environment label
      g.append('text')
        .attr('x', width * 0.5)
        .attr('y', height * 0.32)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .style('font-size', '12px')
        .text('My Development Environment');

      // Add laptop icon outside Platform VPC
      const laptopIcon = g.append('g')
        .attr('transform', `translate(${width * 0.5}, ${height * 0.05})`);

      // Laptop base
      laptopIcon.append('rect')
        .attr('x', -30)
        .attr('y', 0)
        .attr('width', 60)
        .attr('height', 40)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('fill', 'rgba(30, 41, 59, 0.8)')
        .attr('stroke', 'rgba(255, 255, 255, 0.4)')
        .attr('stroke-width', 2);

      // Laptop screen
      laptopIcon.append('rect')
        .attr('x', -25)
        .attr('y', 5)
        .attr('width', 50)
        .attr('height', 30)
        .attr('rx', 2)
        .attr('ry', 2)
        .attr('fill', 'rgba(255, 255, 255, 0.1)')
        .attr('stroke', 'rgba(255, 255, 255, 0.2)')
        .attr('stroke-width', 1);

      // Add laptop label
      g.append('text')
        .attr('x', width * 0.5)
        .attr('y', height * 0.02)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .style('font-size', '12px')
        .text('My Developer Device (MacBook)');

      // Add connection line from laptop to My Environment
      g.append('line')
        .attr('x1', width * 0.5)
        .attr('y1', height * 0.1)
        .attr('x2', width * 0.5)
        .attr('y2', height * 0.3)
        .attr('stroke', 'rgba(255, 255, 255, 0.4)')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');

      // Create a force simulation with adjusted parameters
      const simulation = d3
        .forceSimulation(nodes)
        .force('link', d3.forceLink(connections)
          .id((d) => d.id)
          .distance(120)
        )
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(60))
        .force('boundary', () => {
          nodes.forEach(node => {
            // Keep nodes within My Environment rectangle
            node.x = Math.max(width * 0.3, Math.min(width * 0.7, node.x));
            node.y = Math.max(height * 0.3, Math.min(height * 0.7, node.y));
          });
        })
        .alphaDecay(0.05);

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
          .on('end', dragended))
        .on('click', (event, d) => {
          event.stopPropagation();
          onNodeClick(d);
        });

      // Add shapes to nodes
      node.each(function(d) {
        const nodeGroup = d3.select(this);
        
        if (d.id === 'database') {
          // Create database stack icon
          nodeGroup
            .append('path')
            .attr('d', createDatabaseIcon(35))
            .attr('fill', '#3b82f6')
            .attr('stroke', '#1e40af')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer');
        } else if (d.id === 'frontend') {
          // Create frontend browser icon
          nodeGroup
            .append('path')
            .attr('d', createFrontendIcon(35))
            .attr('fill', '#10b981')
            .attr('stroke', '#059669')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer');
        } else {
          // Create hexagon for services
          nodeGroup
            .append('path')
            .attr('d', createHexagonPath(35))
            .attr('fill', '#3b82f6')
            .attr('stroke', '#1e40af')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer');
        }

        // Add text labels to nodes
        nodeGroup
          .append('text')
          .attr('dy', 45)
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .text((d) => d.name)
          .style('font-size', '14px')
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

      // Store the simulation reference
      simulationRef.current = simulation;
    }

    return () => {
      // Cleanup simulation when component unmounts
      if (simulationRef.current) {
        simulationRef.current.stop();
        simulationRef.current = null;
      }
    };
  }, [nodes, connections, createHexagonPath]);

  return <svg ref={svgRef} className="w-full h-full" />;
});

export default GraphVisualization;
