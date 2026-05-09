import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorMiddleware } from './middleware/error.middleware';
import { logger } from './utils/logger';
import dropsRoutes from './routes/drops.routes';
import reservationsRoutes from './routes/reservations.routes';
import purchasesRoutes from './routes/purchases.routes';
import usersRoutes from './routes/users.routes';

const app = express();

//  CORS 
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id'],
  })
);

//  Body parsing 
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

//  Request logging 
app.use((req, _res, next) => {
  logger.debug(`${req.method} ${req.path}`);
  next();
});

//  Health check 
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

//  API routes 
app.use('/api/users', usersRoutes);
app.use('/api/drops', dropsRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/purchases', purchasesRoutes);

//  404 handler 
app.use((_req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found', statusCode: 404 } });
});

//  Centralized error handler (must be last) 
app.use(errorMiddleware);

export default app;
