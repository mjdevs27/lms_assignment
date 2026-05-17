import mongoose from 'mongoose';
import { env } from './env';

/**
 * Connect to MongoDB using Mongoose.
 * Exits the process if connection fails.
 */
export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    console.log(` MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(' MongoDB connection failed:', error);
    process.exit(1);
  }

  // Connection event listeners
  mongoose.connection.on('connected', () => {
    console.log(' Mongoose connected to DB');
  });

  mongoose.connection.on('error', (err) => {
    console.error(' Mongoose connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn(' Mongoose disconnected from DB');
  });
};

/**
 * Returns the current Mongoose connection ready-state as a human-readable string.
 */
export const getDBStatus = (): string => {
  const states: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] ?? 'unknown';
};
