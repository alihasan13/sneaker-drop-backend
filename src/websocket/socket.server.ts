import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { socketEmitter } from './socket.emitter';
import prisma from '../config/database';

export function initSocketServer(httpServer: HttpServer): SocketServer {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: env.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // Reconnection is handled client-side; server just accepts connections
    pingTimeout: 20000,
    pingInterval: 10000,
  });

  // Wire the singleton emitter to this io instance
  socketEmitter.init(io);

  io.on('connection', (socket: Socket) => {
    const clientId = socket.id;
    logger.debug(`Socket connected: ${clientId}`);

    //  Room management 
    // Client joins the drop room to receive live stock updates
    socket.on('drop:join', async ({ dropId }: { dropId: string }) => {
      if (!dropId || typeof dropId !== 'string') return;

      socket.join(`drop:${dropId}`);
      logger.debug(`Socket ${clientId} joined drop:${dropId}`);

      // Immediately send authoritative stock to reconnecting client
      // This prevents stale UI after a reconnect
      try {
        const inventory = await prisma.inventory.findUnique({ where: { dropId } });
        if (inventory) {
          socket.emit('stock:update', {
            dropId,
            availableStock: inventory.totalStock - inventory.reservedStock - inventory.soldStock,
            reservedStock: inventory.reservedStock,
            soldStock: inventory.soldStock,
            totalStock: inventory.totalStock,
          });
        }
      } catch {
        // Non-critical: client will get next broadcast
      }
    });

    socket.on('drop:leave', ({ dropId }: { dropId: string }) => {
      if (!dropId) return;
      socket.leave(`drop:${dropId}`);
      logger.debug(`Socket ${clientId} left drop:${dropId}`);
    });

    //  User private channel 
    // Client subscribes to their own channel for reservation expiry notices
    socket.on('user:subscribe', ({ userId }: { userId: string }) => {
      if (!userId || typeof userId !== 'string') return;
      socket.join(`user:${userId}`);
      logger.debug(`Socket ${clientId} subscribed to user:${userId}`);
    });

    socket.on('disconnect', (reason) => {
      logger.debug(`Socket disconnected: ${clientId}, reason: ${reason}`);
    });
  });

  logger.info('Socket.io server initialized');
  return io;
}
