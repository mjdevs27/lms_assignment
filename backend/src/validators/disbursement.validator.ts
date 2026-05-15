import mongoose from 'mongoose';

export interface DisbursementValidationResult {
  valid: boolean;
  error?: string;
  code?: string;
}

export const validateLoanId = (loanId: unknown): DisbursementValidationResult => {
  if (!loanId || typeof loanId !== 'string') {
    return { valid: false, error: 'Loan ID is required.', code: 'INVALID_LOAN_ID' };
  }
  if (!mongoose.Types.ObjectId.isValid(loanId)) {
    return { valid: false, error: 'Invalid loan ID format.', code: 'INVALID_LOAN_ID' };
  }
  return { valid: true };
};

export const validateDisbursementLoanQuery = (
  query: Record<string, unknown>,
): DisbursementValidationResult => {
  if (query.minAmount !== undefined && query.minAmount !== '') {
    const val = Number(query.minAmount);
    if (isNaN(val) || val < 0) {
      return { valid: false, error: 'minAmount must be a non-negative number.', code: 'QUERY_INVALID' };
    }
  }
  if (query.maxAmount !== undefined && query.maxAmount !== '') {
    const val = Number(query.maxAmount);
    if (isNaN(val) || val < 0) {
      return { valid: false, error: 'maxAmount must be a non-negative number.', code: 'QUERY_INVALID' };
    }
  }
  if (
    query.sortOrder !== undefined &&
    query.sortOrder !== '' &&
    query.sortOrder !== 'asc' &&
    query.sortOrder !== 'desc'
  ) {
    return { valid: false, error: 'sortOrder must be asc or desc.', code: 'QUERY_INVALID' };
  }
  return { valid: true };
};

export const validateDisbursementBody = (body: unknown): DisbursementValidationResult => {
  if (body !== null && typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body.', code: 'QUERY_INVALID' };
  }
  const b = (body ?? {}) as Record<string, unknown>;

  if (b.remarks !== undefined && b.remarks !== null && b.remarks !== '') {
    if (typeof b.remarks !== 'string') {
      return {
        valid: false,
        error: 'remarks must be a string.',
        code: 'DISBURSEMENT_REMARKS_INVALID',
      };
    }
    if ((b.remarks as string).length > 500) {
      return {
        valid: false,
        error: 'remarks must not exceed 500 characters.',
        code: 'DISBURSEMENT_REMARKS_INVALID',
      };
    }
  }

  if (b.disbursementReference !== undefined && b.disbursementReference !== null && b.disbursementReference !== '') {
    if (typeof b.disbursementReference !== 'string') {
      return {
        valid: false,
        error: 'disbursementReference must be a string.',
        code: 'DISBURSEMENT_REFERENCE_INVALID',
      };
    }
    if ((b.disbursementReference as string).length > 100) {
      return {
        valid: false,
        error: 'disbursementReference must not exceed 100 characters.',
        code: 'DISBURSEMENT_REFERENCE_INVALID',
      };
    }
  }

  return { valid: true };
};
