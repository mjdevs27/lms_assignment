import { BRE_CONSTANTS } from '../constants/bre.constants';

/**
 * Normalize a PAN string to uppercase and trimmed.
 */
export const normalizePan = (pan: string): string => {
  return pan.trim().toUpperCase();
};

/**
 * Validate PAN format against the standard Indian PAN regex.
 */
export const isValidPanFormat = (pan: string): boolean => {
  return BRE_CONSTANTS.PAN_REGEX.test(pan);
};
