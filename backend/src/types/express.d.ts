import { IUser } from './user.types';

/**
 * Augment Express Request to include the authenticated user.
 */
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
