import { z } from 'zod';

export const createDropSchema = z.object({
  name: z.string().min(2).max(100),
  brand: z.string().min(1).max(50),
  colorway: z.string().min(1).max(50),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url().optional(),
  price: z.number().positive().multipleOf(0.01),
  totalStock: z.number().int().positive().max(10000),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
});

export const dropIdParamSchema = z.object({
  id: z.string().min(1),
});

export type CreateDropInput = z.infer<typeof createDropSchema>;
