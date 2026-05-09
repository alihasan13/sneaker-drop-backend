import { ReservationStatus } from '@prisma/client';
import prisma from '../config/database';
import { Errors } from '../utils/AppError';
import { inventoryRepository } from '../repositories/inventory.repository';
import { reservationsRepository } from '../repositories/reservations.repository';
import { socketEmitter } from '../websocket/socket.emitter';
import { env } from '../config/env';
import { logger } from '../utils/logger';

// Raw query row shape returned by SELECT FOR UPDATE
interface RawInventory {
  id: string;
  dropId: string;
  totalStock: number;
  reservedStock: number;
  soldStock: number;
}

export const reservationsService = {
  /**
   * CRITICAL PATH: Creates a reservation with pessimistic locking.
   * NOWAIT: if row is locked by a concurrent transaction, immediately
   * throw a 503 instead of queuing (fail-fast under extreme contention).
   */
  async createReservation(userId: string, dropId: string, quantity: number) {
    let reservation;

    try {
      reservation = await prisma.$transaction(
        async (tx) => {
          //  Step 1: Pessimistic row lock 
          const rows = await tx.$queryRaw<RawInventory[]>`
            SELECT id, "dropId", "totalStock", "reservedStock", "soldStock"
            FROM inventory
            WHERE "dropId" = ${dropId}
            FOR UPDATE NOWAIT
          `;

          if (!rows.length) {
            throw Errors.notFound('Drop inventory');
          }

          const inv = rows[0];
          const available = inv.totalStock - inv.reservedStock - inv.soldStock;

          //  Step 2: Stock check (inside locked section) 
          if (available < quantity) {
            throw Errors.outOfStock();
          }

          //  Step 3: Duplicate reservation guard 
          const existingReservation = await tx.reservation.findFirst({
            where: { userId, dropId, status: ReservationStatus.PENDING },
          });

          if (existingReservation) {
            throw Errors.alreadyReserved();
          }

          // ── Step 4: Atomic reservedStock increment 
          // The DB CHECK constraint (reservedStock + soldStock <= totalStock)
          // acts as a final safety net even if our check above somehow passed.
          await tx.inventory.update({
            where: { dropId },
            data: { reservedStock: { increment: quantity } },
          });

          //  Step 5: Insert reservation 
          return tx.reservation.create({
            data: {
              userId,
              dropId,
              quantity,
              status: ReservationStatus.PENDING,
              expiresAt: new Date(Date.now() + env.RESERVATION_EXPIRY_MS),
            },
            include: {
              drop: {
                select: { id: true, name: true, brand: true, colorway: true, price: true, imageUrl: true },
              },
            },
          });
        },
        { timeout: 5000 } // 5s max: prevent long-held locks
      );
    } catch (err: any) {
      // Rethrow our own AppErrors directly
      if (err?.isOperational) throw err;

      // PostgreSQL error code 55P03 = lock_not_available (NOWAIT rejected)
      const isLockError =
        err?.code === '55P03' ||
        err?.message?.includes('could not obtain lock') ||
        err?.meta?.code === '55P03';

      if (isLockError) {
        logger.warn('Inventory lock contention', { dropId, userId });
        throw Errors.lockUnavailable();
      }

      logger.error('Reservation transaction failed', { error: err?.message, dropId, userId });
      throw err;
    }

    //  Post-commit: broadcast real-time stock update 
    const updatedInventory = await inventoryRepository.findByDropId(dropId);
    if (updatedInventory) {
      socketEmitter.broadcastStockUpdate(dropId, updatedInventory);
    }

    return {
      id: reservation.id,
      dropId: reservation.dropId,
      userId: reservation.userId,
      quantity: reservation.quantity,
      status: reservation.status,
      expiresAt: reservation.expiresAt,
      drop: reservation.drop
        ? { ...reservation.drop, price: Number(reservation.drop.price) }
        : null,
    };
  },

  async cancelReservation(reservationId: string, userId: string) {
    const reservation = await prisma.reservation.findFirst({
      where: { id: reservationId, userId, status: ReservationStatus.PENDING },
    });

    if (!reservation) {
      throw Errors.notFound('Active reservation');
    }

    await prisma.$transaction(async (tx) => {
      await tx.reservation.update({
        where: { id: reservationId },
        data: { status: ReservationStatus.CANCELLED },
      });
      await tx.inventory.update({
        where: { dropId: reservation.dropId },
        data: { reservedStock: { decrement: reservation.quantity } },
      });
    });

    const updatedInventory = await inventoryRepository.findByDropId(reservation.dropId);
    if (updatedInventory) {
      socketEmitter.broadcastStockUpdate(reservation.dropId, updatedInventory);
    }
  },

  async getUserReservations(userId: string) {
    return reservationsRepository.findAllActiveByUser(userId);
  },

  async getActiveReservation(userId: string, dropId: string) {
    return reservationsRepository.findActiveByUser(userId, dropId);
  },
};
