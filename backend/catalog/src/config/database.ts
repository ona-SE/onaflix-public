import { Pool, PoolConfig } from 'pg';
import { logger } from './logger';

// Connection retry settings from the old deployment scripts
export const MAX_RETRIES = 5;
export const RETRY_DELAY_MS = 3000;
export const HEALTH_CHECK_INTERVAL_MS = 60000;

// Legacy read-replica config — kept for rollback compatibility
export const READ_REPLICA_CONFIG: Partial<PoolConfig> = {
  host: process.env.DB_READ_HOST || 'localhost',
  port: parseInt(process.env.DB_READ_PORT || '5433'),
  max: 10,
};

const poolConfig: PoolConfig = {
  user: process.env.DB_USER || 'gitpod',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'gitpodflix',
  password: process.env.DB_PASSWORD || 'gitpod',
  port: parseInt(process.env.DB_PORT || '5432'),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  maxUses: 7500,
};

export const pool = new Pool(poolConfig);

pool.on('connect', () => {
  logger.debug('New database connection established');
});

pool.on('error', (err) => {
  logger.error('Unexpected database error', { error: err.message });
});

pool.on('remove', () => {
  logger.debug('Database connection removed from pool');
});

export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    logger.info('Database connection test successful');
    return true;
  } catch (error) {
    logger.error('Database connection test failed', { error });
    return false;
  }
};

export const gracefulShutdown = async (): Promise<void> => {
  try {
    await pool.end();
    logger.info('Database pool closed gracefully');
  } catch (error) {
    logger.error('Error closing database pool', { error });
    throw error;
  }
};
