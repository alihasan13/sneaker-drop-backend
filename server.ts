import 'dotenv/config';
import http from 'http';
import app from './src/app';
import { env } from './src/config/env';
import { initSocketServer } from './src/websocket/socket.server';
import { startExpiryJob } from './src/jobs/expiry.job';
import { logger } from './src/utils/logger';
import prisma from './src/config/database';

async function bootstrap() {
  // Verify DB connection before starting
  try {
    await prisma.$connect();
    logger.info('Database connected');
  } catch (err) {
    logger.error('Failed to connect to database', { error: err });
    process.exit(1);
  }

  const httpServer = http.createServer(app);

  // Initialize Socket.io on the same HTTP server (shared port)
  initSocketServer(httpServer);

  // Start reservation expiry cron job
  startExpiryJob();

  httpServer.listen(env.PORT, () => {
    logger.info(`Server running on http://localhost:${env.PORT}`);
    logger.info(`Environment: ${env.NODE_ENV}`);
    logger.info(`Frontend URL: ${env.FRONTEND_URL}`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);
    httpServer.close(async () => {
      await prisma.$disconnect();
      logger.info('Server closed');
      process.exit(0);
    });
    // Force exit after 10s
    setTimeout(() => process.exit(1), 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled rejection', { reason });
  });
}

bootstrap();
