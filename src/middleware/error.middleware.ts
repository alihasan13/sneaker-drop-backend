import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { env } from '../config/env';

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    statusCode: number;
    stack?: string;
  };
}

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    const body: ErrorResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        statusCode: err.statusCode,
        ...(env.isDev && { stack: err.stack }),
      },
    };
    res.status(err.statusCode).json(body);
    return;
  }

  // Unknown / unhandled error
  logger.error('Unhandled error', { error: err.message, stack: err.stack, url: req.url });

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: env.isDev ? err.message : 'An unexpected error occurred',
      statusCode: 500,
      ...(env.isDev && { stack: err.stack }),
    },
  });
}
