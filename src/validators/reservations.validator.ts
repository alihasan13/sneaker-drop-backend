import { z } from 'zod';

export const createReservationSchema = z.object({
  dropId: z.string().min(1),
  quantity: z.number().int().positive().max(1).default(1), // max 1 per user
});

export const reservationIdParamSchema = z.object({
  id: z.string().min(1),
});

export const confirmPurchaseSchema = z.object({
  reservationId: z.string().min(1),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type ConfirmPurchaseInput = z.infer<typeof confirmPurchaseSchema>;
