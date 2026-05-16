import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';

/**
 * Bootstrap sequence:
 * 1. Load environment (already loaded via env.ts import)
 * 2. Connect to MongoDB
 * 3. Start Express server
 */
const startServer = async (): Promise<void> => {
  // Step 1 — Connect to database
  await connectDB();

  // Step 2 — Start Express
  app.listen(env.PORT, () => {
    console.log(` Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
  });
};

// ---------------------------------------------------------------------------
// Graceful shutdown
// ---------------------------------------------------------------------------
const gracefulShutdown = (signal: string): void => {
  console.log(`\n${signal} received — shutting down gracefully…`);
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Catch unhandled rejections
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Catch uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start
startServer();
