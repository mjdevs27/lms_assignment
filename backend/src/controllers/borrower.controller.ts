import { Request, Response, NextFunction } from 'express';
import { validateBorrowerProfile } from '../validators/borrower.validator';
import { checkEligibility, updateBorrowerProfile, getBorrowerProfile } from '../services/borrower.service';
import { ApiError } from '../utils/ApiError';

/**
 * POST /api/borrower/eligibility-check
 * Run BRE on submitted details without saving.
 */
export const eligibilityCheck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { fullName, pan, dob, monthlySalary, employmentMode } = req.body;
    const input = { fullName, pan, dob, monthlySalary, employmentMode };

    // Input validation
    const validation = validateBorrowerProfile(input);
    if (!validation.valid) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      });
      return;
    }

    // Run BRE
    const result = checkEligibility(input);

    if (result.eligible) {
      res.status(200).json({
        success: true,
        message: 'Applicant is eligible.',
        data: { eligible: true, failures: [] },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Applicant is not eligible.',
        data: { eligible: false, failures: result.failures },
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/borrower/profile
 * Save borrower profile only if BRE passes.
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required');
    }

    const { fullName, pan, dob, monthlySalary, employmentMode } = req.body;
    const input = { fullName, pan, dob, monthlySalary, employmentMode };

    // Input validation
    const validation = validateBorrowerProfile(input);
    if (!validation.valid) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      });
      return;
    }

    // Run BRE and save if eligible
    const { user, breResult } = await updateBorrowerProfile(
      req.user._id.toString(),
      input,
    );

    if (!breResult.eligible) {
      res.status(400).json({
        success: false,
        message: 'Profile not saved. Applicant is not eligible.',
        data: { eligible: false, failures: breResult.failures },
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user: user.toJSON() },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/borrower/profile
 * Return the authenticated borrower's profile.
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required');
    }

    const user = await getBorrowerProfile(req.user._id.toString());

    res.status(200).json({
      success: true,
      message: 'Borrower profile fetched successfully.',
      data: { user: user.toJSON() },
    });
  } catch (error) {
    next(error);
  }
};
