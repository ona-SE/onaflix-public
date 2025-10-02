import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { ApiError } from '../types/api.types';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.warn('Operational error', {
      statusCode: err.statusCode,
      message: err.message,
      path: req.path,
      method: req.method,
    });

    res.status(err.statusCode).json({
      error: err.message,
    } as ApiError);
    return;
  }

  logger.error('Unexpected error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    error: 'Internal server error',
  } as ApiError);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: `Route ${req.method} ${req.path} not found`,
  } as ApiError);
};
