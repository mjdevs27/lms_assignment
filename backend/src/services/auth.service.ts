import User from '../models/User.model';
import { IUser } from '../types/user.types';
import { USER_ROLES } from '../constants/roles';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';

interface SignupInput {
  fullName: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResult {
  user: IUser;
  token: string;
}

/**
 * Register a new borrower account.
 * Public signup always creates BORROWER role regardless of client input.
 */
export const signupBorrower = async (input: SignupInput): Promise<AuthResult> => {
  const { fullName, email, password } = input;

  // Validation
  const errors: string[] = [];
  if (!fullName || fullName.trim().length < 2) {
    errors.push('Full name must be at least 2 characters');
  }
  if (!email || !email.trim()) {
    errors.push('Email is required');
  }
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (errors.length > 0) {
    const err = new ApiError(400, 'Validation failed');
    (err as ApiError & { errors: string[] }).errors = errors;
    throw err;
  }

  // Check for duplicate email
  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    throw new ApiError(409, 'Email already exists');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user with BORROWER role (ignore any client-sent role)
  const user = await User.create({
    fullName: fullName.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
    role: USER_ROLES.BORROWER,
  });

  // Generate JWT
  const token = generateToken({
    userId: user._id.toString(),
    role: user.role,
  });

  return { user, token };
};

/**
 * Authenticate an existing user (any role).
 */
export const loginUser = async (input: LoginInput): Promise<AuthResult> => {
  const { email, password } = input;

  // Validation
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  // Find user and explicitly include passwordHash for comparison
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Check if account is active
  if (!user.isActive) {
    throw new ApiError(403, 'Account is inactive');
  }

  // Compare password
  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Generate JWT
  const token = generateToken({
    userId: user._id.toString(),
    role: user.role,
  });

  return { user, token };
};
