import { Request, Response } from 'express';
import { reservationsService } from '../services/reservations.service';
import { asyncHandler } from '../utils/asyncHandler';

const success = (res: Response, data: unknown, statusCode = 200) =>
  res.status(statusCode).json({ success: true, data });

export const reservationsController = {
  createReservation: asyncHandler(async (req: Request, res: Response) => {
    const { id: userId } = res.locals.user;
    const { dropId, quantity } = req.body;
    const reservation = await reservationsService.createReservation(userId, dropId, quantity ?? 1);
    success(res, reservation, 201);
  }),

  cancelReservation: asyncHandler(async (req: Request, res: Response) => {
    const { id: userId } = res.locals.user;
    await reservationsService.cancelReservation(req.params.id, userId);
    success(res, { message: 'Reservation cancelled' });
  }),

  getMyReservations: asyncHandler(async (req: Request, res: Response) => {
    const { id: userId } = res.locals.user;
    const reservations = await reservationsService.getUserReservations(userId);
    success(res, reservations);
  }),

  getActiveReservationForDrop: asyncHandler(async (req: Request, res: Response) => {
    const { id: userId } = res.locals.user;
    const { dropId } = req.params;
    const reservation = await reservationsService.getActiveReservation(userId, dropId);
    success(res, reservation);
  }),
};
