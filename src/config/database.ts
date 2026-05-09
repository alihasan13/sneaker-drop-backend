import { PrismaClient } from '@prisma/client';
import { env } from './env';

// Singleton pattern — prevents connection pool exhaustion from multiple instances
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: env.isDev ? ['warn', 'error'] : ['error'],
  });

if (env.isDev) globalForPrisma.prisma = prisma;

export default prisma;
