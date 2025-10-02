import { Request, Response } from 'express';
import { pool, testConnection } from '../config/database';
import { CacheService } from '../services/cacheService';
import { HealthStatus } from '../types/api.types';
import { logger } from '../config/logger';

export class HealthController {
  private startTime: number;

  constructor(private cacheService: CacheService) {
    this.startTime = Date.now();
  }

  getHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const [dbConnected, cacheResponseTime] = await Promise.all([
        this.checkDatabase(),
        this.cacheService.ping(),
      ]);

      const status: HealthStatus = {
        status: dbConnected ? 'OK' : 'DEGRADED',
        timestamp: new Date().toISOString(),
        database: {
          connected: dbConnected,
          responseTime: dbConnected ? await this.getDatabaseResponseTime() : undefined,
        },
        cache: {
          connected: this.cacheService.isAvailable(),
          responseTime: cacheResponseTime > 0 ? cacheResponseTime : undefined,
        },
        uptime: Math.floor((Date.now() - this.startTime) / 1000),
      };

      if (!dbConnected) {
        status.status = 'ERROR';
        res.status(503).json(status);
        return;
      }

      res.json(status);
    } catch (error) {
      logger.error('Health check error', { error });
      res.status(503).json({
        status: 'ERROR',
        timestamp: new Date().toISOString(),
        database: { connected: false },
        cache: { connected: false },
        uptime: Math.floor((Date.now() - this.startTime) / 1000),
      });
    }
  };

  private async checkDatabase(): Promise<boolean> {
    try {
      return await testConnection();
    } catch (error) {
      return false;
    }
  }

  private async getDatabaseResponseTime(): Promise<number> {
    try {
      const startTime = Date.now();
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      return Date.now() - startTime;
    } catch (error) {
      return -1;
    }
  }
}
