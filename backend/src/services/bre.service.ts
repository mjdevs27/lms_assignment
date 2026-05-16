import { BRE_CONSTANTS } from '../constants/bre.constants';
import { EMPLOYMENT_MODES, EMPLOYMENT_MODE_VALUES, EmploymentMode } from '../constants/employmentModes';
import { BREInput, BREResult, BREFailure } from '../types/bre.types';
import { calculateAge, isFutureDate } from '../utils/age.util';
import { normalizePan, isValidPanFormat } from '../utils/pan.util';

/**
 * Run all Business Rule Engine eligibility checks on the provided input.
 * Returns all failures together -- does not stop after the first failed rule.
 */
export const runEligibilityCheck = (input: BREInput): BREResult => {
  const failures: BREFailure[] = [];

  // -------------------------------------------------------------------------
  // Rule 1: DOB validation and age check
  // -------------------------------------------------------------------------
  const dobDate = new Date(input.dob);

  if (isNaN(dobDate.getTime())) {
    failures.push({
      field: 'dob',
      code: 'INVALID_DOB',
      message: 'Date of birth is invalid.',
    });
  } else if (isFutureDate(dobDate)) {
    failures.push({
      field: 'dob',
      code: 'INVALID_DOB',
      message: 'Date of birth cannot be in the future.',
    });
  } else {
    const age = calculateAge(dobDate);
    if (age < BRE_CONSTANTS.MIN_AGE || age > BRE_CONSTANTS.MAX_AGE) {
      failures.push({
        field: 'dob',
        code: 'AGE_NOT_ELIGIBLE',
        message: `Age must be between ${BRE_CONSTANTS.MIN_AGE} and ${BRE_CONSTANTS.MAX_AGE} inclusive. Current age: ${age}.`,
      });
    }
  }

  // -------------------------------------------------------------------------
  // Rule 2: Monthly salary check
  // -------------------------------------------------------------------------
  if (
    input.monthlySalary === undefined ||
    input.monthlySalary === null ||
    input.monthlySalary < BRE_CONSTANTS.MIN_MONTHLY_SALARY
  ) {
    failures.push({
      field: 'monthlySalary',
      code: 'SALARY_BELOW_MINIMUM',
      message: `Monthly salary must be at least INR ${BRE_CONSTANTS.MIN_MONTHLY_SALARY}.`,
    });
  }

  // -------------------------------------------------------------------------
  // Rule 3: PAN validation
  // -------------------------------------------------------------------------
  const normalizedPan = normalizePan(input.pan || '');
  if (!isValidPanFormat(normalizedPan)) {
    failures.push({
      field: 'pan',
      code: 'INVALID_PAN',
      message: 'PAN must match format: ABCDE1234F.',
    });
  }

  // -------------------------------------------------------------------------
  // Rule 4: Employment mode check
  // -------------------------------------------------------------------------
  const modeValue = input.employmentMode as string;
  if (!EMPLOYMENT_MODE_VALUES.includes(modeValue as EmploymentMode)) {
    failures.push({
      field: 'employmentMode',
      code: 'INVALID_EMPLOYMENT_MODE',
      message: `Employment mode must be one of: ${EMPLOYMENT_MODE_VALUES.join(', ')}.`,
    });
  } else if (modeValue === EMPLOYMENT_MODES.UNEMPLOYED) {
    failures.push({
      field: 'employmentMode',
      code: 'UNEMPLOYED_NOT_ELIGIBLE',
      message: 'Unemployed applicants are not eligible.',
    });
  }

  return {
    eligible: failures.length === 0,
    failures,
  };
};
