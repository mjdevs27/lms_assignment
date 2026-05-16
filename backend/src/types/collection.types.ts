export interface CollectionLoanSummary {
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
  totalPaid: number;
  outstandingAmount: number;
  status: 'DISBURSED';
  disbursedBy?: string;
  disbursedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CollectionLoansQuery {
  page?: unknown;
  limit?: unknown;
  search?: unknown;
  sortBy?: unknown;
  sortOrder?: unknown;
  minOutstanding?: unknown;
  maxOutstanding?: unknown;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
