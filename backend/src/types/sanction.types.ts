export interface SanctionLoanSummary {
  id: string;
  borrowerId: string;
  fullName: string;
  pan: string;
  dob: Date;
  monthlySalary: number;
  employmentMode: string;
  salarySlipUrl: string;
  loanAmount: number;
  tenureDays: number;
  interestRate: number;
  interestAmount: number;
  totalRepayment: number;
  outstandingAmount: number;
  status: 'APPLIED';
  createdAt: Date;
  updatedAt: Date;
}

export interface SanctionLoansQuery {
  page?: unknown;
  limit?: unknown;
  search?: unknown;
  sortBy?: unknown;
  sortOrder?: unknown;
  minAmount?: unknown;
  maxAmount?: unknown;
  employmentMode?: unknown;
}

export interface ApproveLoanInput {
  remarks?: string;
}

export interface RejectLoanInput {
  reason: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
