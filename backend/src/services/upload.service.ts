import fs from 'fs';
import path from 'path';
import User from '../models/User.model';
import { IUser } from '../types/user.types';
import { ApiError } from '../utils/ApiError';
import { generateSafeFilename, SALARY_SLIP_DIR } from '../utils/file.util';
import { runEligibilityCheck } from './bre.service';

interface UploadResult {
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
}

/**
 * Process salary slip upload for a borrower.
 * Re-runs BRE on the saved profile to confirm eligibility before accepting.
 */
export const processSalarySlipUpload = async (
  user: IUser,
  file: Express.Multer.File,
): Promise<UploadResult> => {
  // Check profile completeness
  if (!user.isProfileComplete) {
    // Clean up the temp file
    fs.unlinkSync(file.path);
    throw new ApiError(400, 'Borrower profile must be completed before uploading salary slip.');
  }

  // Re-run BRE using saved profile fields
  if (!user.pan || !user.dob || user.monthlySalary === undefined || !user.employmentMode) {
    fs.unlinkSync(file.path);
    throw new ApiError(400, 'Borrower profile is incomplete. Complete your profile first.');
  }

  const breResult = runEligibilityCheck({
    pan: user.pan,
    dob: user.dob,
    monthlySalary: user.monthlySalary,
    employmentMode: user.employmentMode,
  });

  if (!breResult.eligible) {
    fs.unlinkSync(file.path);
    throw new ApiError(400, 'Borrower profile does not pass eligibility check. Update your profile first.');
  }

  // Rename the temporary file to a safe name
  const safeFilename = generateSafeFilename(user._id.toString(), file.originalname);
  const finalPath = path.join(SALARY_SLIP_DIR, safeFilename);
  fs.renameSync(file.path, finalPath);

  // Build the public URL
  const url = `/uploads/salary-slips/${safeFilename}`;

  // Save metadata to user document
  await User.findByIdAndUpdate(user._id, {
    salarySlipUrl: url,
    salarySlipOriginalName: file.originalname,
    salarySlipMimeType: file.mimetype,
    salarySlipSize: file.size,
    salarySlipUploadedAt: new Date(),
    salarySlipStoragePath: finalPath,
  });

  return {
    url,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  };
};
