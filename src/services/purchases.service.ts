import { ReservationStatus } from '@prisma/client';
import prisma from '../config/database';
import { Errors } from '../utils/AppError';
import { inventoryRepository } from '../repositories/inventory.repository';
import { purchasesRepository } from '../repositories/purchases.repository';
import { socketEmitter } from '../websocket/socket.emitter';
import { logger } from '../utils/logger';

interface RawReservation {
  id: string;
  userId: string;
  dropId: string;
  quantity: number;
  status: string;
  expiresAt: Date;
}

export const purchasesService = {
  /**
   * Confirms a purchase from an active reservation.

   */
  async confirmPurchase(userId: string, reservationId: string) {
    let purchase;

    try {
      purchase = await prisma.$transaction(
        async (tx) => {
          //  Lock the reservation row 
          const rows = await tx.$queryRaw<RawReservation[]>`
            SELECT id, "userId", "dropId", quantity, status, "expiresAt"
            FROM reservations
            WHERE id = ${reservationId}
              AND "userId" = ${userId}
            FOR UPDATE NOWAIT
          `;

          if (!rows.length) {
            throw Errors.notFound('Reservation');
          }

          const reservation = rows[0];

          //  Idempotency / state guards 
          if (reservation.status === ReservationStatus.COMPLETED) {
            throw Errors.alreadyPurchased();
          }

          if (reservation.status !== ReservationStatus.PENDING) {
            throw Errors.reservationInvalid(
              `Reservation is ${reservation.status.toLowerCase()} and cannot be purchased`
            );
          }

          if (reservation.expiresAt < new Date()) {
            throw Errors.reservationInvalid('Reservation has expired');
          }

          //  Get drop price 
          const drop = await tx.drop.findUnique({
            where: { id: reservation.dropId },
            select: { price: true, name: true },
          });

          if (!drop) throw Errors.notFound('Drop');

          //  Mark reservation completed 
          await tx.reservation.update({
            where: { id: reservationId },
            data: { status: ReservationStatus.COMPLETED },
          });

          //  Convert reservedStock → soldStock (atomic, net neutral) 
          await tx.inventory.update({
            where: { dropId: reservation.dropId },
            data: {
              reservedStock: { decrement: reservation.quantity },
              soldStock: { increment: reservation.quantity },
            },
          });

          //  Insert purchase record 
          return tx.purchase.create({
            data: {
              userId,
              dropId: reservation.dropId,
              reservationId,
              quantity: reservation.quantity,
              totalPrice: Number(drop.price) * reservation.quantity,
            },
            include: {
              drop: { select: { id: true, name: true, brand: true, colorway: true, imageUrl: true } },
              user: { select: { id: true, name: true, avatarUrl: true } },
            },
          });
        },
        { timeout: 5000 }
      );
    } catch (err: any) {
      if (err?.isOperational) throw err;

      const isLockError =
        err?.code === '55P03' ||
        err?.message?.includes('could not obtain lock') ||
        err?.meta?.code === '55P03';

      if (isLockError) {
        logger.warn('Purchase lock contention', { reservationId, userId });
        throw Errors.lockUnavailable();
      }

      logger.error('Purchase transaction failed', { error: err?.message, reservationId, userId });
      throw err;
    }

    //  Post-commit: broadcast purchase event 
    const updatedInventory = await inventoryRepository.findByDropId(purchase.dropId);
    if (updatedInventory) {
      socketEmitter.broadcastStockUpdate(purchase.dropId, updatedInventory);
    }

    socketEmitter.broadcastPurchase(purchase.dropId, {
      userId: purchase.userId,
      userName: purchase.user.name,
      dropId: purchase.dropId,
      dropName: purchase.drop.name,
      purchasedAt: purchase.createdAt,
    });

    return {
      id: purchase.id,
      dropId: purchase.dropId,
      reservationId: purchase.reservationId,
      quantity: purchase.quantity,
      totalPrice: Number(purchase.totalPrice),
      createdAt: purchase.createdAt,
      drop: purchase.drop,
    };
  },

  async getUserPurchases(userId: string) {
    const purchases = await purchasesRepository.findByUser(userId);
    return purchases.map((p) => ({
      ...p,
      totalPrice: Number(p.totalPrice),
      drop: { ...p.drop, price: Number(p.drop.price) },
    }));
  },
};
