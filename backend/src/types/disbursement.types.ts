export interface DisbursementLoanSummary {
  id: string;
  borrowerId: string;
  fullName: string;
  pan: string;
  monthlySalary: number;
  employmentMode: string;
  salarySlipUrl: string;
  loanAmount: number;
  tenureDays: number;
  interestRate: number;
  interestAmount: number;
  totalRepayment: number;
  outstandingAmount: number;
  status: 'SANCTIONED';
  sanctionedBy?: string;
  sanctionedAt?: Date;
  sanctionRemarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DisbursementLoansQuery {
  page?: unknown;
  limit?: unknown;
  search?: unknown;
  sortBy?: unknown;
  sortOrder?: unknown;
  minAmount?: unknown;
  maxAmount?: unknown;
}

export interface DisburseInput {
  remarks?: string;
  disbursementReference?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
