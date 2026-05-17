/**
 * Business Rule Engine constants for borrower eligibility checks.
 */

export const BRE_CONSTANTS = {
  MIN_AGE: 23,
  MAX_AGE: 50,
  MIN_MONTHLY_SALARY: 25000,
  PAN_REGEX: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
} as const;
