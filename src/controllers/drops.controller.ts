import { Request, Response } from 'express';
import { dropsService } from '../services/drops.service';
import { asyncHandler } from '../utils/asyncHandler';
import { CreateDropInput } from '../validators/drops.validator';

const success = (res: Response, data: unknown, statusCode = 200) =>
  res.status(statusCode).json({ success: true, data });

export const dropsController = {
  getActiveDrops: asyncHandler(async (_req, res) => {
    const drops = await dropsService.getActiveDrops();
    success(res, drops);
  }),

  getAllDropsAdmin: asyncHandler(async (_req, res) => {
    const drops = await dropsService.getAllDropsAdmin();
    success(res, drops);
  }),

  getDropById: asyncHandler(async (req, res) => {
    const drop = await dropsService.getDropById(req.params.id);
    success(res, drop);
  }),

  createDrop: asyncHandler(async (req, res) => {
    const drop = await dropsService.createDrop(req.body as CreateDropInput);
    success(res, drop, 201);
  }),

  activateDrop: asyncHandler(async (req, res) => {
    const drop = await dropsService.activateDrop(req.params.id);
    success(res, drop);
  }),
};
