import bcrypt from 'bcrypt';
import { env } from '../config/env';

/**
 * Hash a plain-text password using bcrypt.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(env.BCRYPT_SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain-text password against a bcrypt hash.
 */
export const comparePassword = async (
  password: string,
  passwordHash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, passwordHash);
};
