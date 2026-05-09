export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(statusCode: number, code: string, message?: string) {
    super(message || code);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// Convenience factories
export const Errors = {
  notFound: (resource = 'Resource') =>
    new AppError(404, 'NOT_FOUND', `${resource} not found`),

  outOfStock: () =>
    new AppError(409, 'OUT_OF_STOCK', 'This drop is sold out'),

  alreadyReserved: () =>
    new AppError(409, 'ALREADY_RESERVED', 'You already have an active reservation for this drop'),

  reservationInvalid: (reason: string) =>
    new AppError(409, 'RESERVATION_INVALID', reason),

  alreadyPurchased: () =>
    new AppError(409, 'ALREADY_PURCHASED', 'This reservation has already been used to make a purchase'),

  lockUnavailable: () =>
    new AppError(503, 'LOCK_UNAVAILABLE', 'High demand right now — please try again in a moment'),

  unauthorized: () =>
    new AppError(401, 'UNAUTHORIZED', 'You must be logged in'),

  forbidden: () =>
    new AppError(403, 'FORBIDDEN', 'You do not have permission to perform this action'),

  validationError: (message: string) =>
    new AppError(400, 'VALIDATION_ERROR', message),
};
