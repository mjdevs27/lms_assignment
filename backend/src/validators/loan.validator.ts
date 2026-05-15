import {
  MIN_LOAN_AMOUNT,
  MAX_LOAN_AMOUNT,
  MIN_TENURE_DAYS,
  MAX_TENURE_DAYS,
} from '../constants/loan.constants';

export interface LoanValidationError {
  field: string;
  code: string;
  message: string;
}

export interface LoanValidationResult {
  valid: boolean;
  errors: LoanValidationError[];
}

export interface LoanInput {
  loanAmount: unknown;
  tenureDays: unknown;
}

export const validateLoanInput = (input: LoanInput): LoanValidationResult => {
  const errors: LoanValidationError[] = [];

  if (input.loanAmount === undefined || input.loanAmount === null) {
    errors.push({
      field: 'loanAmount',
      code: 'LOAN_AMOUNT_REQUIRED',
      message: 'Loan amount is required.',
    });
  } else if (typeof input.loanAmount !== 'number' || isNaN(input.loanAmount as number)) {
    errors.push({
      field: 'loanAmount',
      code: 'LOAN_AMOUNT_INVALID',
      message: 'Loan amount must be a valid number.',
    });
  } else if ((input.loanAmount as number) < MIN_LOAN_AMOUNT) {
    errors.push({
      field: 'loanAmount',
      code: 'LOAN_AMOUNT_BELOW_MINIMUM',
      message: `Loan amount must be at least ${MIN_LOAN_AMOUNT}.`,
    });
  } else if ((input.loanAmount as number) > MAX_LOAN_AMOUNT) {
    errors.push({
      field: 'loanAmount',
      code: 'LOAN_AMOUNT_ABOVE_MAXIMUM',
      message: `Loan amount must not exceed ${MAX_LOAN_AMOUNT}.`,
    });
  }

  if (input.tenureDays === undefined || input.tenureDays === null) {
    errors.push({
      field: 'tenureDays',
      code: 'TENURE_REQUIRED',
      message: 'Tenure in days is required.',
    });
  } else if (typeof input.tenureDays !== 'number' || isNaN(input.tenureDays as number)) {
    errors.push({
      field: 'tenureDays',
      code: 'TENURE_INVALID',
      message: 'Tenure must be a valid number.',
    });
  } else if (!Number.isInteger(input.tenureDays as number)) {
    errors.push({
      field: 'tenureDays',
      code: 'TENURE_INVALID',
      message: 'Tenure must be an integer.',
    });
  } else if ((input.tenureDays as number) < MIN_TENURE_DAYS) {
    errors.push({
      field: 'tenureDays',
      code: 'TENURE_BELOW_MINIMUM',
      message: `Tenure must be at least ${MIN_TENURE_DAYS} days.`,
    });
  } else if ((input.tenureDays as number) > MAX_TENURE_DAYS) {
    errors.push({
      field: 'tenureDays',
      code: 'TENURE_ABOVE_MAXIMUM',
      message: `Tenure must not exceed ${MAX_TENURE_DAYS} days.`,
    });
  }

  return { valid: errors.length === 0, errors };
};
