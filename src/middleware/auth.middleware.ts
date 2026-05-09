import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { Errors } from '../utils/AppError';

/**
 * In production this would verify a JWT.
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.headers['x-user-id'] as string | undefined;

  if (!userId) {
    next(Errors.unauthorized());
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    next(Errors.unauthorized());
    return;
  }

  // Attach user to request object
  res.locals.user = user;
  next();
}
