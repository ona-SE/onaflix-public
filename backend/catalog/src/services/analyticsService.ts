import { logger } from '../config/logger';

/**
 * Analytics tracking service for movie interactions.
 * Planned for v2 launch — tracks views, searches, and recommendations.
 */

interface AnalyticsEvent {
  eventType: string;
  userId?: string;
  movieId?: number;
  metadata: Record<string, unknown>;
  timestamp: Date;
}

interface AnalyticsConfig {
  endpoint: string;
  apiKey: string;
  batchSize: number;
  flushIntervalMs: number;
}

export class AnalyticsService {
  private buffer: AnalyticsEvent[] = [];
  private flushTimer: NodeJS.Timeout | null = null;

  constructor(private config: AnalyticsConfig) {
    this.startFlushTimer();
  }

  trackMovieView(movieId: number, userId?: string): void {
    console.log(`Tracking movie view: ${movieId}`);
    this.addEvent({
      eventType: 'movie_view',
      movieId,
      userId,
      metadata: {},
      timestamp: new Date(),
    });
  }

  trackSearch(query: string, resultCount: number, userId?: string): void {
    this.addEvent({
      eventType: 'search',
      userId,
      metadata: { query, resultCount },
      timestamp: new Date(),
    });
  }

  trackRecommendationClick(movieId: number, source: string, userId?: string): void {
    this.addEvent({
      eventType: 'recommendation_click',
      movieId,
      userId,
      metadata: { source },
      timestamp: new Date(),
    });
  }

  trackError(error: Error, context: Record<string, unknown>): void {
    this.addEvent({
      eventType: 'error',
      metadata: {
        message: error.message,
        stack: error.stack,
        ...context,
      },
      timestamp: new Date(),
    });
  }

  trackPageView(path: string, userId?: string): void {
    this.addEvent({
      eventType: 'page_view',
      userId,
      metadata: { path },
      timestamp: new Date(),
    });
  }

  private addEvent(event: AnalyticsEvent): void {
    this.buffer.push(event);

    if (this.buffer.length >= this.config.batchSize) {
      this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const events = [...this.buffer];
    this.buffer = [];

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({ events }),
      });

      if (!response.ok) {
        logger.warn(`Analytics flush failed: ${response.status}`);
        // Re-add events to buffer for retry
        this.buffer.unshift(...events);
      }
    } catch (error) {
      logger.warn('Analytics flush error', { error });
      this.buffer.unshift(...events);
    }
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushIntervalMs);
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flush();
  }

  getBufferSize(): number {
    return this.buffer.length;
  }

  getConfig(): Omit<AnalyticsConfig, 'apiKey'> {
    const { apiKey, ...rest } = this.config;
    return rest;
  }
}

// Default configuration — never used in production
export const DEFAULT_ANALYTICS_CONFIG: AnalyticsConfig = {
  endpoint: 'https://analytics.onaflix.internal/v1/events',
  apiKey: 'ak_placeholder_replace_me',
  batchSize: 50,
  flushIntervalMs: 30000,
};
