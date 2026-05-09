import prisma from '../config/database';
import { ReservationStatus } from '@prisma/client';

export const reservationsRepository = {
  findActiveByUser(userId: string, dropId: string) {
    return prisma.reservation.findFirst({
      where: { userId, dropId, status: ReservationStatus.PENDING },
      include: {
        drop: { select: { id: true, name: true, brand: true, colorway: true, price: true, imageUrl: true } },
      },
    });
  },

  findByIdAndUser(id: string, userId: string) {
    return prisma.reservation.findFirst({
      where: { id, userId },
      include: {
        drop: { select: { id: true, name: true, price: true } },
      },
    });
  },

  findAllActiveByUser(userId: string) {
    return prisma.reservation.findMany({
      where: { userId, status: ReservationStatus.PENDING },
      include: {
        drop: { select: { id: true, name: true, brand: true, colorway: true, price: true, imageUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Used only by expiry cron — raw query with SKIP LOCKED is used there
  findExpiredPending() {
    return prisma.reservation.findMany({
      where: {
        status: ReservationStatus.PENDING,
        expiresAt: { lte: new Date() },
      },
    });
  },
};
