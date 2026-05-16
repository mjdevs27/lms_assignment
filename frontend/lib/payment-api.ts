import type { ApiResponse } from "@/types/api.types";
import type { Payment } from "@/types/payment.types";
import { apiRequest, FrontendApiError } from "./api";

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

export async function getMyPayments(): Promise<Payment[]> {
  try {
    const res = await apiRequest<ApiResponse<{ payments: Record<string, unknown>[] }>>("/borrower/my-payments");
    if (!res.success || !res.data?.payments) {
      return [];
    }
    return res.data.payments.map(normalizePayment);
  } catch (err) {
    if (err instanceof FrontendApiError && err.status === 404) {
      return [];
    }
    throw err;
  }
}
