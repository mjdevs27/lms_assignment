import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import borrowerRoutes from './routes/borrower.routes';
import dashboardRoutes from './routes/dashboard.routes';
import adminRoutes from './routes/admin.routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ---------------------------------------------------------------------------
// Static file serving for uploads
// ---------------------------------------------------------------------------
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/borrower', borrowerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

// Development-only debug routes for middleware testing
if (env.NODE_ENV === 'development') {
  import('./routes/debug.routes').then((debugRoutes) => {
    app.use('/api/debug', debugRoutes.default);
    console.log('[DEV] Debug routes registered at /api/debug');
  });
}

// ---------------------------------------------------------------------------
// 404 handler -- unknown routes
// ---------------------------------------------------------------------------
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${_req.method} ${_req.originalUrl}`,
  });
});

// ---------------------------------------------------------------------------
// Global error handler (must be registered last)
// ---------------------------------------------------------------------------
app.use(errorMiddleware);

export default app;
