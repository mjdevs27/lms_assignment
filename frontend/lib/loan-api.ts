import type { ApiResponse } from "@/types/api.types";
import type { Loan, LoanQuote, LoanQuotePayload } from "@/types/loan.types";
import { apiRequest, FrontendApiError } from "./api";

function normalizeLoan(raw: Record<string, unknown>): Loan {
  return {
    id: (raw.id as string) || (raw._id as string) || "",
    borrowerId: raw.borrowerId as string | undefined,
    fullName: (raw.fullName as string) || "",
    pan: (raw.pan as string) || "",
    loanAmount: (raw.loanAmount as number) || 0,
    tenureDays: (raw.tenureDays as number) || 0,
    interestRate: (raw.interestRate as number) || 0,
    interestAmount: (raw.interestAmount as number) || 0,
    totalRepayment: (raw.totalRepayment as number) || 0,
    totalPaid: (raw.totalPaid as number) || 0,
    outstandingAmount: (raw.outstandingAmount as number) || 0,
    status: raw.status as Loan["status"],
    rejectionReason: raw.rejectionReason as string | undefined,
    createdAt: raw.createdAt as string | undefined,
    updatedAt: raw.updatedAt as string | undefined,
  };
}

export async function getLoanQuote(payload: LoanQuotePayload): Promise<LoanQuote> {
  const res = await apiRequest<ApiResponse<LoanQuote>>("/borrower/loan/quote", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to get loan quote");
  }

  return res.data;
}

export async function applyForLoan(payload: LoanQuotePayload): Promise<Loan> {
  const res = await apiRequest<ApiResponse<{ loan: Record<string, unknown> }>>("/borrower/apply-loan", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.success || !res.data?.loan) {
    throw new Error(res.message || "Failed to apply for loan");
  }

  return normalizeLoan(res.data.loan);
}

export async function getMyLoan(): Promise<Loan | null> {
  try {
    const res = await apiRequest<ApiResponse<{ loan: Record<string, unknown> }>>("/borrower/my-loan");
    if (!res.success || !res.data?.loan) {
      return null;
    }
    return normalizeLoan(res.data.loan);
  } catch (err) {
    if (err instanceof FrontendApiError && err.status === 404) {
      return null;
    }
    throw err;
  }
}

export async function getMyLoans(): Promise<Loan[]> {
  try {
    const res = await apiRequest<ApiResponse<{ loans: Record<string, unknown>[] }>>("/borrower/my-loans");
    if (!res.success || !res.data?.loans) {
      return [];
    }
    return res.data.loans.map(normalizeLoan);
  } catch (err) {
    if (err instanceof FrontendApiError && err.status === 404) {
      return [];
    }
    throw err;
  }
}
