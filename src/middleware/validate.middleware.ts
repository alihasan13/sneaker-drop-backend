import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../utils/AppError';

export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const message = result.error.errors
        .map((e: ZodError['errors'][number]) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      return next(new AppError(400, 'VALIDATION_ERROR', message));
    }
    req[source] = result.data;
    next();
  };
}
