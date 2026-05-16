import { EmploymentMode } from '../constants/employmentModes';

/**
 * Input for the Business Rule Engine eligibility check.
 */
export interface BREInput {
  pan: string;
  dob: string | Date;
  monthlySalary: number;
  employmentMode: EmploymentMode | string;
}

/**
 * Failure codes returned by the BRE.
 */
export type BREFailureCode =
  | 'INVALID_DOB'
  | 'AGE_NOT_ELIGIBLE'
  | 'SALARY_BELOW_MINIMUM'
  | 'INVALID_PAN'
  | 'UNEMPLOYED_NOT_ELIGIBLE'
  | 'INVALID_EMPLOYMENT_MODE';

/**
 * A single BRE failure entry.
 */
export interface BREFailure {
  field: string;
  code: BREFailureCode;
  message: string;
}

/**
 * Result of a BRE eligibility check.
 */
export interface BREResult {
  eligible: boolean;
  failures: BREFailure[];
}
