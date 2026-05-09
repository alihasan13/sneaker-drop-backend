import { Server as SocketServer } from 'socket.io';
import { InventorySnapshot } from '../repositories/inventory.repository';

interface PurchaseEvent {
  userId: string;
  userName: string;
  dropId: string;
  dropName: string;
  purchasedAt: Date;
}

/**
 * Singleton WebSocket emitter.
 
 */
class SocketEmitter {
  private io: SocketServer | null = null;

  init(io: SocketServer) {
    this.io = io;
  }

  toRoom(room: string, event: string, data: unknown) {
    if (!this.io) return;
    this.io.to(room).emit(event, data);
  }

  broadcastStockUpdate(dropId: string, inventory: InventorySnapshot) {
    this.toRoom(`drop:${dropId}`, 'stock:update', {
      dropId,
      availableStock: inventory.availableStock,
      reservedStock: inventory.reservedStock,
      soldStock: inventory.soldStock,
      totalStock: inventory.totalStock,
    });
  }

  broadcastPurchase(dropId: string, data: PurchaseEvent) {
    this.toRoom(`drop:${dropId}`, 'purchase:new', data);
  }

  notifyReservationExpired(userId: string, reservationId: string, dropId: string) {
    this.toRoom(`user:${userId}`, 'reservation:expired', { reservationId, dropId });
  }

  notifyDropStatus(dropId: string, isActive: boolean) {
    this.toRoom(`drop:${dropId}`, 'drop:status', { dropId, isActive });
  }
}

// Export singleton instance
export const socketEmitter = new SocketEmitter();
