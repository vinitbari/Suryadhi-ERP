import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { config } from '../config';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    code?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Extract a clean, user-friendly error message from any error type.
 */
function getReadableMessage(err: Error | AppError): string {
  const raw = err.message || '';

  // Prisma connection errors
  if (raw.includes("Can't reach database server") || raw.includes('PrismaClientInitializationError')) {
    return 'Unable to connect to the database. Please try again in a moment.';
  }

  // Prisma unique constraint
  if (raw.includes('Unique constraint failed')) {
    const field = raw.match(/fields:\s*\(`(.+?)`\)/)?.[1] || 'field';
    return `A record with this ${field} already exists.`;
  }

  // Prisma record not found
  if (raw.includes('Record to update not found') || raw.includes('Record to delete does not exist')) {
    return 'The requested record was not found.';
  }

  // Prisma generic query errors
  if (raw.includes('PrismaClientKnownRequestError') || raw.includes('PrismaClientValidationError')) {
    return 'A database error occurred. Please try again.';
  }

  // JWT errors
  if (raw.includes('jwt expired') || raw.includes('TokenExpiredError')) {
    return 'Your session has expired. Please log in again.';
  }
  if (raw.includes('invalid signature') || raw.includes('JsonWebTokenError')) {
    return 'Invalid authentication token. Please log in again.';
  }

  // Network errors
  if (raw.includes('ECONNREFUSED') || raw.includes('ETIMEDOUT')) {
    return 'A service is temporarily unavailable. Please try again.';
  }

  return raw;
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';
  let code: string | undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
  } else {
    // For non-AppError errors, extract a readable message
    message = getReadableMessage(err);
  }

  // Log error
  if (statusCode >= 500) {
    logger.error({
      err,
      method: req.method,
      url: req.url,
      ip: req.ip,
      userId: (req as any).user?.userId,
    }, 'Server error');
  } else {
    logger.warn({
      err: { message: err.message, statusCode },
      method: req.method,
      url: req.url,
    }, 'Client error');
  }

  const response: any = {
    success: false,
    error: message,
  };

  if (code) {
    response.code = code;
  }

  // Only include raw stack/details in development
  if (config.isDev) {
    response.stack = err.stack;
    // Don't send raw details — the `error` field already has a readable message
  }

  res.status(statusCode).json(response);
};

// 404 handler
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
  });
};
