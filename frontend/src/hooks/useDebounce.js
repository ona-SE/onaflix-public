import { useState, useEffect } from 'react';

/**
 * Debounce hook for search input.
 * Was used in the old SearchBar before switching to the server-side suggestions API.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useThrottle(value, limit = 300) {
  const [throttledValue, setThrottledValue] = useState(value);
  const [lastRan, setLastRan] = useState(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan >= limit) {
        setThrottledValue(value);
        setLastRan(Date.now());
      }
    }, limit - (Date.now() - lastRan));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit, lastRan]);

  return throttledValue;
}
