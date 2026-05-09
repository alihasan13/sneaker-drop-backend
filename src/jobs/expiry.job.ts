import cron from 'node-cron';
import prisma from '../config/database';
import { inventoryRepository } from '../repositories/inventory.repository';
import { socketEmitter } from '../websocket/socket.emitter';
import { logger } from '../utils/logger';
import { env } from '../config/env';

interface ExpiredRow {
  id: string;
  userId: string;
  dropId: string;
  quantity: number;
}

/**
 * Reservation Expiry Cron Job
 * Runs every CRON_INTERVAL_SECONDS (default: 10s).
 * Strategy: SELECT FOR UPDATE SKIP LOCKED
 */
export function startExpiryJob() {
  const schedule = `*/${env.CRON_INTERVAL_SECONDS} * * * * *`;

  cron.schedule(schedule, async () => {
    try {
      const expired = await prisma.$transaction(
        async (tx) => {
          //  Select expired PENDING reservations with SKIP LOCKED 
          const rows = await tx.$queryRaw<ExpiredRow[]>`
            SELECT r.id, r."userId", r."dropId", r.quantity
            FROM reservations r
            WHERE r.status = 'PENDING'
              AND r."expiresAt" <= NOW()
            FOR UPDATE SKIP LOCKED
            LIMIT 50
          `;

          if (rows.length === 0) return [];

          const ids = rows.map((r) => r.id);

          // ── Batch expire 
          await tx.reservation.updateMany({
            where: { id: { in: ids } },
            data: { status: 'EXPIRED' },
          });

          //  Return reservedStock per drop 
          // Group by dropId to minimize inventory UPDATE calls
          const byDrop = rows.reduce<Record<string, { quantity: number; userIds: string[] }>>(
            (acc, row) => {
              if (!acc[row.dropId]) acc[row.dropId] = { quantity: 0, userIds: [] };
              acc[row.dropId].quantity += row.quantity;
              acc[row.dropId].userIds.push(row.userId);
              return acc;
            },
            {}
          );

          for (const [dropId, { quantity }] of Object.entries(byDrop)) {
            await tx.inventory.update({
              where: { dropId },
              data: { reservedStock: { decrement: quantity } },
            });
          }

          return rows;
        },
        { timeout: 10_000 }
      );

      if (expired.length === 0) return;

      logger.info(`Expired ${expired.length} reservation(s)`);

      // ── Post-commit: broadcast updates ──────────────────────────────
      const affectedDropIds = [...new Set(expired.map((r) => r.dropId))];

      for (const dropId of affectedDropIds) {
        const inventory = await inventoryRepository.findByDropId(dropId);
        if (inventory) {
          socketEmitter.broadcastStockUpdate(dropId, inventory);
        }
      }

      for (const r of expired) {
        socketEmitter.notifyReservationExpired(r.userId, r.id, r.dropId);
      }
    } catch (err: any) {
      logger.error('Expiry cron job failed', { error: err?.message });
    }
  });

  logger.info(`Reservation expiry cron started (every ${env.CRON_INTERVAL_SECONDS}s)`);
}
