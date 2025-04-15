import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock the WebSocket hook
vi.mock('../hooks/useWebSocket', () => ({
  useWebSocket: () => ({
    isConnected: false,
    nodes: [],
    connections: [],
    simulateLoad: vi.fn()
  })
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    render(<App />);
    expect(screen.getByText('Connecting to streaming platform services...')).toBeInTheDocument();
  });
});