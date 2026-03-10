import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

/**
 * JWT authentication middleware.
 * Prepared for the premium tier feature — not yet wired into routes.
 */

interface JwtPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // TODO: Replace with actual jwt.verify() once jsonwebtoken is configured
    const decoded = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    ) as JwtPayload;

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      res.status(401).json({ error: 'Token expired' });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Invalid authentication token', { error });
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};

export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    ) as JwtPayload;
    req.user = decoded;
  } catch {
    // Silently ignore invalid tokens for optional auth
  }

  next();
};
