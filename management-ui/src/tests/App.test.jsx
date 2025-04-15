import { describe, it, expect, vi, beforeEach } from 'vitest';
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

// Mock SVG element and its properties
const mockSVGElement = {
  clientWidth: 800,
  clientHeight: 600,
  viewBox: {
    baseVal: {
      x: 0,
      y: 0,
      width: 800,
      height: 600
    }
  },
  getBBox: () => ({
    x: 0,
    y: 0,
    width: 800,
    height: 600
  }),
  getScreenCTM: () => ({
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: 0
  }),
  createSVGPoint: () => ({
    x: 0,
    y: 0,
    matrixTransform: () => ({ x: 0, y: 0 })
  })
};

// Mock HTMLElement properties
Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
  configurable: true,
  value: 800
});

Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
  configurable: true,
  value: 600
});

// Mock SVGElement properties
Object.defineProperty(SVGElement.prototype, 'viewBox', {
  configurable: true,
  value: mockSVGElement.viewBox
});

Object.defineProperty(SVGElement.prototype, 'getBBox', {
  configurable: true,
  value: mockSVGElement.getBBox
});

Object.defineProperty(SVGElement.prototype, 'getScreenCTM', {
  configurable: true,
  value: mockSVGElement.getScreenCTM
});

Object.defineProperty(SVGElement.prototype, 'createSVGPoint', {
  configurable: true,
  value: mockSVGElement.createSVGPoint
});

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    render(<App />);
    expect(screen.getByText('Connecting to streaming platform services...')).toBeInTheDocument();
  });
});