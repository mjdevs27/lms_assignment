import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole } from '../constants/roles';

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

/**
 * Generate a signed JWT token.
 */
export const generateToken = (payload: JwtPayload): string => {
  const options: SignOptions = {};
  if (env.JWT_EXPIRES_IN) {
    // The ms library's StringValue type is narrower than plain string;
    // cast is safe because jwt.sign handles arbitrary duration strings at runtime.
    (options as Record<string, unknown>).expiresIn = env.JWT_EXPIRES_IN;
  }
  return jwt.sign(payload, env.JWT_SECRET, options);
};

/**
 * Verify and decode a JWT token.
 * Throws if the token is invalid or expired.
 */
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};
