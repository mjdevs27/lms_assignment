import { EmploymentMode } from '../constants/employmentModes';

/**
 * Input for borrower profile update and eligibility check.
 */
export interface BorrowerProfileInput {
  fullName: string;
  pan: string;
  dob: string;
  monthlySalary: number;
  employmentMode: EmploymentMode | string;
}
