import { Document, Types } from 'mongoose';
import { UserRole } from '../constants/roles';
import { EmploymentMode } from '../constants/employmentModes';

/**
 * Mongoose User document interface.
 */
export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  pan?: string;
  dob?: Date;
  monthlySalary?: number;
  employmentMode?: EmploymentMode;
  isProfileComplete?: boolean;
  eligibilityStatus?: string;
  eligibilityCheckedAt?: Date;
  salarySlipUrl?: string;
  salarySlipOriginalName?: string;
  salarySlipMimeType?: string;
  salarySlipSize?: number;
  salarySlipUploadedAt?: Date;
  salarySlipStoragePath?: string;
  createdAt: Date;
  updatedAt: Date;
}
