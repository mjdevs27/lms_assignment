import { EMPLOYMENT_MODE_VALUES } from '../constants/employmentModes';
import { BorrowerProfileInput } from '../types/borrower.types';

/**
 * Validation result for borrower profile input.
 */
interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate borrower profile input fields before BRE processing.
 */
export const validateBorrowerProfile = (input: BorrowerProfileInput): ValidationResult => {
  const errors: string[] = [];

  // fullName: required, string, 2-100 characters
  if (!input.fullName || typeof input.fullName !== 'string') {
    errors.push('Full name is required.');
  } else if (input.fullName.trim().length < 2) {
    errors.push('Full name must be at least 2 characters.');
  } else if (input.fullName.trim().length > 100) {
    errors.push('Full name must not exceed 100 characters.');
  }

  // pan: required
  if (!input.pan || typeof input.pan !== 'string') {
    errors.push('PAN is required.');
  }

  // dob: required and valid date
  if (!input.dob) {
    errors.push('Date of birth is required.');
  } else {
    const dobDate = new Date(input.dob);
    if (isNaN(dobDate.getTime())) {
      errors.push('Date of birth must be a valid date.');
    }
  }

  // monthlySalary: required and numeric
  if (input.monthlySalary === undefined || input.monthlySalary === null) {
    errors.push('Monthly salary is required.');
  } else if (typeof input.monthlySalary !== 'number' || isNaN(input.monthlySalary)) {
    errors.push('Monthly salary must be a number.');
  }

  // employmentMode: required and valid enum
  if (!input.employmentMode || typeof input.employmentMode !== 'string') {
    errors.push('Employment mode is required.');
  } else if (!EMPLOYMENT_MODE_VALUES.includes(input.employmentMode as any)) {
    errors.push(`Employment mode must be one of: ${EMPLOYMENT_MODE_VALUES.join(', ')}.`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
