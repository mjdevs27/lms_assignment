import mongoose from 'mongoose';

export interface SanctionValidationResult {
  valid: boolean;
  error?: string;
  code?: string;
}

export const validateLoanId = (loanId: unknown): SanctionValidationResult => {
  if (!loanId || typeof loanId !== 'string') {
    return { valid: false, error: 'Loan ID is required.', code: 'INVALID_LOAN_ID' };
  }
  if (!mongoose.Types.ObjectId.isValid(loanId)) {
    return { valid: false, error: 'Invalid loan ID format.', code: 'INVALID_LOAN_ID' };
  }
  return { valid: true };
};

export const validateSanctionLoanQuery = (query: Record<string, unknown>): SanctionValidationResult => {
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

export const validateApproveLoanBody = (body: unknown): SanctionValidationResult => {
  if (body !== null && typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body.', code: 'QUERY_INVALID' };
  }
  const b = (body ?? {}) as Record<string, unknown>;
  if (b.remarks !== undefined && b.remarks !== null && b.remarks !== '') {
    if (typeof b.remarks !== 'string') {
      return { valid: false, error: 'remarks must be a string.', code: 'SANCTION_REMARKS_INVALID' };
    }
    if (b.remarks.length > 500) {
      return {
        valid: false,
        error: 'remarks must not exceed 500 characters.',
        code: 'SANCTION_REMARKS_INVALID',
      };
    }
  }
  return { valid: true };
};

export const validateRejectLoanBody = (body: unknown): SanctionValidationResult => {
  if (body === null || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body.', code: 'QUERY_INVALID' };
  }
  const b = body as Record<string, unknown>;
  if (!b.reason) {
    return { valid: false, error: 'reason is required.', code: 'REJECTION_REASON_REQUIRED' };
  }
  if (typeof b.reason !== 'string') {
    return { valid: false, error: 'reason must be a string.', code: 'REJECTION_REASON_INVALID' };
  }
  if ((b.reason as string).length < 5) {
    return {
      valid: false,
      error: 'reason must be at least 5 characters.',
      code: 'REJECTION_REASON_TOO_SHORT',
    };
  }
  if ((b.reason as string).length > 500) {
    return {
      valid: false,
      error: 'reason must not exceed 500 characters.',
      code: 'REJECTION_REASON_TOO_LONG',
    };
  }
  return { valid: true };
};
