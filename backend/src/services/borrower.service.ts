import User from '../models/User.model';
import { IUser } from '../types/user.types';
import { BorrowerProfileInput } from '../types/borrower.types';
import { BREResult } from '../types/bre.types';
import { runEligibilityCheck } from './bre.service';
import { normalizePan } from '../utils/pan.util';
import { EmploymentMode } from '../constants/employmentModes';
import { ApiError } from '../utils/ApiError';

/**
 * Run eligibility check without saving. Returns the BRE result directly.
 */
export const checkEligibility = (input: BorrowerProfileInput): BREResult => {
  return runEligibilityCheck({
    pan: input.pan,
    dob: input.dob,
    monthlySalary: input.monthlySalary,
    employmentMode: input.employmentMode,
  });
};

/**
 * Update borrower profile only if BRE passes.
 * Returns the updated user document (sanitized, no passwordHash).
 */
export const updateBorrowerProfile = async (
  userId: string,
  input: BorrowerProfileInput,
): Promise<{ user: IUser; breResult: BREResult }> => {
  // Run BRE
  const breResult = runEligibilityCheck({
    pan: input.pan,
    dob: input.dob,
    monthlySalary: input.monthlySalary,
    employmentMode: input.employmentMode,
  });

  if (!breResult.eligible) {
    return { user: null as unknown as IUser, breResult };
  }

  // BRE passed -- save profile
  const normalizedPan = normalizePan(input.pan);

  const user = await User.findByIdAndUpdate(
    userId,
    {
      fullName: input.fullName.trim(),
      pan: normalizedPan,
      dob: new Date(input.dob),
      monthlySalary: input.monthlySalary,
      employmentMode: input.employmentMode as EmploymentMode,
      isProfileComplete: true,
      eligibilityStatus: 'ELIGIBLE',
      eligibilityCheckedAt: new Date(),
    },
    { new: true, runValidators: true },
  );

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return { user, breResult };
};

/**
 * Fetch borrower profile by user ID.
 */
export const getBorrowerProfile = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};
