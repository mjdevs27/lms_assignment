export const LOAN_STATUS = {
  APPLIED: 'APPLIED',
  SANCTIONED: 'SANCTIONED',
  REJECTED: 'REJECTED',
  DISBURSED: 'DISBURSED',
  CLOSED: 'CLOSED',
} as const;

export type LoanStatus = (typeof LOAN_STATUS)[keyof typeof LOAN_STATUS];

export const LOAN_STATUS_VALUES: LoanStatus[] = Object.values(LOAN_STATUS);

export const ACTIVE_LOAN_STATUSES: LoanStatus[] = [
  LOAN_STATUS.APPLIED,
  LOAN_STATUS.SANCTIONED,
  LOAN_STATUS.DISBURSED,
];

export const MIN_LOAN_AMOUNT = 50000;
export const MAX_LOAN_AMOUNT = 500000;
export const MIN_TENURE_DAYS = 30;
export const MAX_TENURE_DAYS = 365;
export const FIXED_INTEREST_RATE = 12;
export const DAYS_IN_YEAR = 365;
