import dotenv from 'dotenv';
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const env = {
  DATABASE_URL: requireEnv('DATABASE_URL'),
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  RESERVATION_EXPIRY_MS: parseInt(process.env.RESERVATION_EXPIRY_MS || '60000', 10),
  CRON_INTERVAL_SECONDS: parseInt(process.env.CRON_INTERVAL_SECONDS || '10', 10),
  isDev: process.env.NODE_ENV !== 'production',
} as const;
