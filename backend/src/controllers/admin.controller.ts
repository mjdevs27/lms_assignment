import { Request, Response, NextFunction } from 'express';
import User from '../models/User.model';
import { USER_ROLES, UserRole } from '../constants/roles';
import { hashPassword } from '../utils/password';
import { ApiError } from '../utils/ApiError';

const STAFF_ROLES: UserRole[] = [
  USER_ROLES.ADMIN,
  USER_ROLES.SALES,
  USER_ROLES.SANCTION,
  USER_ROLES.DISBURSEMENT,
  USER_ROLES.COLLECTION,
];

/**
 * GET /api/admin/users
 * List all users with optional role/search filter.
 */
export const listAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;

    const query: Record<string, unknown> = {};

    if (role && typeof role === 'string' && role.trim()) {
      query.role = role.toUpperCase();
    }

    if (search && typeof search === 'string' && search.trim()) {
      query.$or = [
        { fullName: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: {
        users: users.map((u) => u.toJSON()),
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/users
 * Create a new staff user. Only ADMIN can call this.
 */
export const createStaffUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!role || !STAFF_ROLES.includes(role as UserRole)) {
      throw new ApiError(400, `Role must be one of: ${STAFF_ROLES.join(', ')}`);
    }

    const errors: string[] = [];
    if (!fullName || String(fullName).trim().length < 2) {
      errors.push('Full name must be at least 2 characters');
    }
    if (!email || !String(email).trim()) {
      errors.push('Email is required');
    }
    if (!password || String(password).length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (errors.length > 0) {
      const err = new ApiError(400, 'Validation failed');
      (err as ApiError & { errors: string[] }).errors = errors;
      throw err;
    }

    const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existing) {
      throw new ApiError(409, 'Email already in use');
    }

    const passwordHash = await hashPassword(String(password));

    const user = await User.create({
      fullName: String(fullName).trim(),
      email: String(email).toLowerCase().trim(),
      passwordHash,
      role: role as UserRole,
      isActive: true,
      isProfileComplete: true,
    });

    res.status(201).json({
      success: true,
      message: 'Staff user created successfully',
      data: { user: user.toJSON() },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      const payload: Record<string, unknown> = {
        success: false,
        message: error.message,
      };
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
 * PATCH /api/admin/users/:userId/toggle-active
 * Toggle a user's isActive status. Admin cannot deactivate themselves.
 */
export const toggleUserActive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (req.user && req.user._id.toString() === userId) {
      throw new ApiError(400, 'Cannot change your own active status');
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user: user.toJSON() },
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
