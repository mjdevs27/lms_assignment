export type EmploymentMode = "SALARIED" | "SELF_EMPLOYED" | "UNEMPLOYED";

export interface BorrowerProfile {
  id?: string;
  fullName: string;
  email?: string;
  pan?: string;
  dob?: string;
  monthlySalary?: number;
  employmentMode?: EmploymentMode;
  isProfileComplete?: boolean;
  eligibilityStatus?: string;
  salarySlipUrl?: string;
  salarySlipUploadedAt?: string;
}

export interface BorrowerProfilePayload {
  fullName: string;
  pan: string;
  dob: string;
  monthlySalary: number;
  employmentMode: EmploymentMode;
}

export interface BreFailure {
  field: string;
  code: string;
  message: string;
}

export interface EligibilityResult {
  eligible: boolean;
  failures: BreFailure[];
}
