import { SeedUserDefinition } from '../types/seed.types';

export const DEFAULT_SEED_PASSWORD = 'Password@123';

export const SEED_USERS: SeedUserDefinition[] = [
  {
    fullName: 'Admin User',
    email: 'admin@lms.com',
    role: 'ADMIN',
  },
  {
    fullName: 'Sales Executive',
    email: 'sales@lms.com',
    role: 'SALES',
  },
  {
    fullName: 'Sanction Executive',
    email: 'sanction@lms.com',
    role: 'SANCTION',
  },
  {
    fullName: 'Disbursement Executive',
    email: 'disbursement@lms.com',
    role: 'DISBURSEMENT',
  },
  {
    fullName: 'Collection Executive',
    email: 'collection@lms.com',
    role: 'COLLECTION',
  },
  {
    fullName: 'Borrower User',
    email: 'borrower@lms.com',
    role: 'BORROWER',
  },
];

export const SEED_BORROWER_PROFILE = {
  email: 'borrower@lms.com',
  pan: 'ABCDE1234F',
  dob: new Date('1998-05-10'),
  monthlySalary: 45000,
  employmentMode: 'SALARIED' as const,
  isProfileComplete: true,
  eligibilityStatus: 'ELIGIBLE' as const,
};
