/**
 * Calculate completed years of age from a date of birth.
 * Uses calendar-based comparison (not millisecond division).
 */
export const calculateAge = (dob: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  // If birthday has not occurred yet this year, subtract one
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
};

/**
 * Check whether a date is in the future.
 */
export const isFutureDate = (date: Date): boolean => {
  return date.getTime() > Date.now();
};
