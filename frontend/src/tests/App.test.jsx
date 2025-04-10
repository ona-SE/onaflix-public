import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock the WebSocket hook
vi.mock('../hooks/useWebSocket', () => ({
  useWebSocket: () => ({
    isConnected: true,
    nodes: [
      { id: 'catalog', name: 'Content Catalog', status: 'active' },
      { id: 'identity', name: 'User Management', status: 'active' },
      { id: 'recommend', name: 'Recommendation Engine', status: 'active' },
      { id: 'stream', name: 'Streaming Service', status: 'active' },
      { id: 'analytics', name: 'Analytics Service', status: 'active' },
      { id: 'database', name: 'Database', status: 'active' }
    ],
    connections: [
      { source: 'frontend', target: 'catalog', type: 'request' },
      { source: 'catalog', target: 'database', type: 'data' }
    ],
    simulateLoad: vi.fn()
  })
}));

describe('App Component', () => {
  it('renders the header', () => {
    render(<App />);
    expect(screen.getByText('Streaming Platform Development Environment')).toBeInTheDocument();
    expect(screen.getByText('Gitpod Flex Demonstration')).toBeInTheDocument();
  });
  
  it('renders the graph visualization', () => {
    render(<App />);
    // Check for the SVG container
    expect(document.querySelector('svg')).toBeInTheDocument();
  });
  
  it('has simulate load button disabled by default', () => {
    render(<App />);
    const button = screen.getByText(/Simulate Load on Service/i);
    expect(button).toBeDisabled();
  });
});