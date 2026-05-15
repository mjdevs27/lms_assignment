import mongoose from 'mongoose';

export interface PaymentValidationResult {
  valid: boolean;
  error?: string;
  code?: string;
}

const UTR_REGEX = /^[A-Z0-9-]{6,50}$/;

export const validateLoanId = (loanId: unknown): PaymentValidationResult => {
  if (!loanId || typeof loanId !== 'string') {
    return { valid: false, error: 'Loan ID is required.', code: 'INVALID_LOAN_ID' };
  }
  if (!mongoose.Types.ObjectId.isValid(loanId)) {
    return { valid: false, error: 'Invalid loan ID format.', code: 'INVALID_LOAN_ID' };
  }
  return { valid: true };
};

export const validateCollectionLoanQuery = (
  query: Record<string, unknown>,
): PaymentValidationResult => {
  if (query.minOutstanding !== undefined && query.minOutstanding !== '') {
    const val = Number(query.minOutstanding);
    if (isNaN(val) || val < 0) {
      return {
        valid: false,
        error: 'minOutstanding must be a non-negative number.',
        code: 'QUERY_INVALID',
      };
    }
  }
  if (query.maxOutstanding !== undefined && query.maxOutstanding !== '') {
    const val = Number(query.maxOutstanding);
    if (isNaN(val) || val < 0) {
      return {
        valid: false,
        error: 'maxOutstanding must be a non-negative number.',
        code: 'QUERY_INVALID',
      };
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

export const validateRecordPaymentBody = (
  body: unknown,
  outstandingAmount?: number,
): PaymentValidationResult => {
  if (body === null || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body.', code: 'QUERY_INVALID' };
  }
  const b = body as Record<string, unknown>;

  if (!b.utrNumber) {
    return { valid: false, error: 'utrNumber is required.', code: 'UTR_REQUIRED' };
  }
  if (typeof b.utrNumber !== 'string') {
    return { valid: false, error: 'utrNumber must be a string.', code: 'UTR_INVALID' };
  }
  const utr = b.utrNumber.trim().toUpperCase();
  if (!UTR_REGEX.test(utr)) {
    return {
      valid: false,
      error: 'utrNumber must be 6-50 alphanumeric characters (A-Z, 0-9, hyphen).',
      code: 'UTR_INVALID',
    };
  }

  if (b.amount === undefined || b.amount === null) {
    return { valid: false, error: 'amount is required.', code: 'AMOUNT_REQUIRED' };
  }
  const amount = Number(b.amount);
  if (isNaN(amount) || typeof amount !== 'number') {
    return { valid: false, error: 'amount must be a number.', code: 'AMOUNT_INVALID' };
  }
  if (amount <= 0) {
    return {
      valid: false,
      error: 'amount must be greater than 0.',
      code: 'AMOUNT_MUST_BE_POSITIVE',
    };
  }
  if (outstandingAmount !== undefined && amount > outstandingAmount + 0.01) {
    return {
      valid: false,
      error: `amount cannot exceed outstanding amount of ${outstandingAmount}.`,
      code: 'AMOUNT_EXCEEDS_OUTSTANDING',
    };
  }

  if (!b.paymentDate) {
    return { valid: false, error: 'paymentDate is required.', code: 'PAYMENT_DATE_REQUIRED' };
  }
  const parsedDate = new Date(b.paymentDate as string);
  if (isNaN(parsedDate.getTime())) {
    return { valid: false, error: 'paymentDate must be a valid date.', code: 'PAYMENT_DATE_INVALID' };
  }
  if (parsedDate > new Date()) {
    return {
      valid: false,
      error: 'paymentDate cannot be in the future.',
      code: 'PAYMENT_DATE_IN_FUTURE',
    };
  }

  return { valid: true };
};

export const validatePaymentQuery = (query: Record<string, unknown>): PaymentValidationResult => {
  if (
    query.sortOrder !== undefined &&
    query.sortOrder !== '' &&
    query.sortOrder !== 'asc' &&
    query.sortOrder !== 'desc'
  ) {
    return { valid: false, error: 'sortOrder must be asc or desc.', code: 'QUERY_INVALID' };
  }
  if (query.loanId !== undefined && query.loanId !== '') {
    if (!mongoose.Types.ObjectId.isValid(String(query.loanId))) {
      return { valid: false, error: 'Invalid loanId format.', code: 'INVALID_LOAN_ID' };
    }
  }
  return { valid: true };
};
