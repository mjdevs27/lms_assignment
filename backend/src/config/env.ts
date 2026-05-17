import dotenv from 'dotenv';

// Load .env file before anything else
dotenv.config();

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  MONGO_URI: string;
  CORS_ORIGIN: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  BCRYPT_SALT_ROUNDS: number;
}

const getEnvVar = (key: string, fallback?: string): string => {
  const value = process.env[key] || fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env: EnvConfig = {
  PORT: parseInt(getEnvVar('PORT', '5000'), 10),
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  MONGO_URI: getEnvVar('MONGO_URI'),
  CORS_ORIGIN: getEnvVar('CORS_ORIGIN', 'http://localhost:3000'),
  JWT_SECRET: getEnvVar('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN', '7d'),
  BCRYPT_SALT_ROUNDS: parseInt(getEnvVar('BCRYPT_SALT_ROUNDS', '10'), 10),
};
