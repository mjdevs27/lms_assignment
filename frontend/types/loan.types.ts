export type LoanStatus = "APPLIED" | "SANCTIONED" | "REJECTED" | "DISBURSED" | "CLOSED";

export interface LoanQuotePayload {
  loanAmount: number;
  tenureDays: number;
}

export interface LoanQuote {
  loanAmount: number;
  tenureDays: number;
  interestRate: number;
  interestAmount: number;
  totalRepayment: number;
  outstandingAmount: number;
}

export interface Loan {
  id: string;
  borrowerId?: string;
  fullName: string;
  pan: string;
  loanAmount: number;
  tenureDays: number;
  interestRate: number;
  interestAmount: number;
  totalRepayment: number;
  totalPaid: number;
  outstandingAmount: number;
  status: LoanStatus;
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
}
