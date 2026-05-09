import { Router } from 'express';
import prisma from '../config/database';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Demo login: list all users so the frontend can show a selector
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, avatarUrl: true },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: users });
  })
);

export default router;
