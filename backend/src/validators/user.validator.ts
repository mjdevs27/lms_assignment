/**
 * Reusable validation utilities for user-related fields.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

/**
 * Validate email format.
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * Validate Indian PAN card format (e.g., ABCDE1234F).
 */
export const isValidPan = (pan: string): boolean => {
  return PAN_REGEX.test(pan);
};
