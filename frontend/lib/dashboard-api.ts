import type { ApiResponse } from "@/types/api.types";
import type { DashboardQueryParams, PaginatedResponse, SalesLead } from "@/types/dashboard.types";
import type { Loan } from "@/types/loan.types";
import type { Payment } from "@/types/payment.types";
import type { RecordPaymentPayload } from "@/types/payment.types";
import { apiRequest } from "./api";

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

function normalizeLead(raw: Record<string, unknown>): SalesLead {
  return {
    id: (raw.id as string) || (raw._id as string) || "",
    fullName: (raw.fullName as string) || "",
    email: (raw.email as string) || "",
    pan: raw.pan as string | undefined,
    dob: raw.dob as string | undefined,
    monthlySalary: raw.monthlySalary as number | undefined,
    employmentMode: raw.employmentMode as string | undefined,
    isProfileComplete: raw.isProfileComplete as boolean | undefined,
    salarySlipUploaded: raw.salarySlipUploaded as boolean | undefined,
    salarySlipUrl: raw.salarySlipUrl as string | undefined,
    createdAt: raw.createdAt as string | undefined,
    updatedAt: raw.updatedAt as string | undefined,
  };
}

function normalizePayment(raw: Record<string, unknown>): Payment {
  return {
    id: (raw.id as string) || (raw._id as string) || "",
    loanId: (raw.loanId as string) || "",
    borrowerId: raw.borrowerId as string | undefined,
    utrNumber: (raw.utrNumber as string) || "",
    amount: (raw.amount as number) || 0,
    paymentDate: (raw.paymentDate as string) || "",
    recordedBy: raw.recordedBy as string | undefined,
    createdAt: raw.createdAt as string | undefined,
    updatedAt: raw.updatedAt as string | undefined,
  };
}

function buildQueryString(params?: DashboardQueryParams): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== "");
  if (entries.length === 0) return "";
  return "?" + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join("&");
}

function extractPaginated<T>(
  data: unknown,
  normalizer: (raw: Record<string, unknown>) => T
): PaginatedResponse<T> {
  if (!data || typeof data !== "object") return { items: [] };
  const d = data as Record<string, unknown>;

  const rawItems: Record<string, unknown>[] =
    (d.leads as Record<string, unknown>[]) ||
    (d.loans as Record<string, unknown>[]) ||
    (d.items as Record<string, unknown>[]) ||
    [];

  return {
    items: rawItems.map(normalizer),
    total: d.total as number | undefined,
    page: d.page as number | undefined,
    limit: d.limit as number | undefined,
    totalPages: d.totalPages as number | undefined,
  };
}

export async function getSalesLeads(params?: DashboardQueryParams): Promise<PaginatedResponse<SalesLead>> {
  const qs = buildQueryString(params);
  const res = await apiRequest<ApiResponse<unknown>>(`/dashboard/sales/leads${qs}`);
  return extractPaginated(res.data, normalizeLead);
}

export async function getSalesLeadById(borrowerId: string): Promise<SalesLead> {
  const res = await apiRequest<ApiResponse<{ lead: Record<string, unknown> }>>(`/dashboard/sales/leads/${borrowerId}`);
  if (!res.data?.lead) throw new Error("Lead not found");
  return normalizeLead(res.data.lead);
}

export async function getSanctionLoans(params?: DashboardQueryParams): Promise<PaginatedResponse<Loan>> {
  const qs = buildQueryString(params);
  const res = await apiRequest<ApiResponse<unknown>>(`/dashboard/sanction/loans${qs}`);
  return extractPaginated(res.data, normalizeLoan);
}

export async function getSanctionLoanById(loanId: string): Promise<Loan> {
  const res = await apiRequest<ApiResponse<{ loan: Record<string, unknown> }>>(`/dashboard/sanction/loans/${loanId}`);
  if (!res.data?.loan) throw new Error("Loan not found");
  return normalizeLoan(res.data.loan);
}

export async function approveLoan(loanId: string, remarks?: string): Promise<Loan> {
  const res = await apiRequest<ApiResponse<{ loan: Record<string, unknown> }>>(`/dashboard/sanction/loans/${loanId}/approve`, {
    method: "PATCH",
    body: JSON.stringify({ remarks }),
  });
  if (!res.data?.loan) throw new Error("Failed to approve loan");
  return normalizeLoan(res.data.loan);
}

export async function rejectLoan(loanId: string, reason: string): Promise<Loan> {
  const res = await apiRequest<ApiResponse<{ loan: Record<string, unknown> }>>(`/dashboard/sanction/loans/${loanId}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });
  if (!res.data?.loan) throw new Error("Failed to reject loan");
  return normalizeLoan(res.data.loan);
}

export async function getDisbursementLoans(params?: DashboardQueryParams): Promise<PaginatedResponse<Loan>> {
  const qs = buildQueryString(params);
  const res = await apiRequest<ApiResponse<unknown>>(`/dashboard/disbursement/loans${qs}`);
  return extractPaginated(res.data, normalizeLoan);
}

export async function getDisbursementLoanById(loanId: string): Promise<Loan> {
  const res = await apiRequest<ApiResponse<{ loan: Record<string, unknown> }>>(`/dashboard/disbursement/loans/${loanId}`);
  if (!res.data?.loan) throw new Error("Loan not found");
  return normalizeLoan(res.data.loan);
}

export async function disburseLoan(
  loanId: string,
  payload?: { remarks?: string; disbursementReference?: string }
): Promise<Loan> {
  const res = await apiRequest<ApiResponse<{ loan: Record<string, unknown> }>>(`/dashboard/disbursement/loans/${loanId}/disburse`, {
    method: "PATCH",
    body: JSON.stringify(payload || {}),
  });
  if (!res.data?.loan) throw new Error("Failed to disburse loan");
  return normalizeLoan(res.data.loan);
}

export async function getCollectionLoans(params?: DashboardQueryParams): Promise<PaginatedResponse<Loan>> {
  const qs = buildQueryString(params);
  const res = await apiRequest<ApiResponse<unknown>>(`/dashboard/collection/loans${qs}`);
  return extractPaginated(res.data, normalizeLoan);
}

export async function getCollectionLoanById(loanId: string): Promise<Loan> {
  const res = await apiRequest<ApiResponse<{ loan: Record<string, unknown> }>>(`/dashboard/collection/loans/${loanId}`);
  if (!res.data?.loan) throw new Error("Loan not found");
  return normalizeLoan(res.data.loan);
}

export async function recordLoanPayment(loanId: string, payload: RecordPaymentPayload): Promise<Payment> {
  const res = await apiRequest<ApiResponse<{ payment: Record<string, unknown> }>>(`/dashboard/collection/loans/${loanId}/payments`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.data?.payment) throw new Error("Failed to record payment");
  return normalizePayment(res.data.payment);
}

export async function getLoanPayments(loanId: string): Promise<Payment[]> {
  const res = await apiRequest<ApiResponse<{ payments: Record<string, unknown>[] }>>(`/dashboard/collection/loans/${loanId}/payments`);
  if (!res.data?.payments) return [];
  return res.data.payments.map(normalizePayment);
}
