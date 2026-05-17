/**
 * Employment mode constants for borrower profiles.
 */
export const EMPLOYMENT_MODES = {
  SALARIED: 'SALARIED',
  SELF_EMPLOYED: 'SELF_EMPLOYED',
  UNEMPLOYED: 'UNEMPLOYED',
} as const;

export type EmploymentMode = (typeof EMPLOYMENT_MODES)[keyof typeof EMPLOYMENT_MODES];

/**
 * Array of all valid employment mode values for Mongoose enum validation.
 */
export const EMPLOYMENT_MODE_VALUES: EmploymentMode[] = Object.values(EMPLOYMENT_MODES);
