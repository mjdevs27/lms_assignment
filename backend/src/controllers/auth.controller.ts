import { Request, Response, NextFunction } from 'express';
import { signupBorrower, loginUser } from '../services/auth.service';
import { ApiError } from '../utils/ApiError';

/**
 * POST /api/auth/signup
 * Register a new borrower account.
 */
export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { fullName, email, password } = req.body;
    const result = await signupBorrower({ fullName, email, password });

    res.status(201).json({
      success: true,
      message: 'Signup successful',
      data: {
        user: result.user.toJSON(),
        token: result.token,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      const payload: Record<string, unknown> = {
        success: false,
        message: error.message,
      };
      // Attach validation errors array if present
      if ('errors' in error) {
        payload.errors = (error as ApiError & { errors: string[] }).errors;
      }
      res.status(error.statusCode).json(payload);
      return;
    }
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Authenticate an existing user.
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user.toJSON(),
        token: result.token,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Return the currently authenticated user.
 */
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required');
    }

    res.status(200).json({
      success: true,
      message: 'Current user fetched successfully',
      data: {
        user: req.user.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};
