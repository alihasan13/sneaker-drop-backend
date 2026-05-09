import { Request, Response } from 'express';
import { purchasesService } from '../services/purchases.service';
import { asyncHandler } from '../utils/asyncHandler';

const success = (res: Response, data: unknown, statusCode = 200) =>
  res.status(statusCode).json({ success: true, data });

export const purchasesController = {
  confirmPurchase: asyncHandler(async (req: Request, res: Response) => {
    const { id: userId } = res.locals.user;
    const { reservationId } = req.body;
    const purchase = await purchasesService.confirmPurchase(userId, reservationId);
    success(res, purchase, 201);
  }),

  getMyPurchases: asyncHandler(async (req: Request, res: Response) => {
    const { id: userId } = res.locals.user;
    const purchases = await purchasesService.getUserPurchases(userId);
    success(res, purchases);
  }),
};
