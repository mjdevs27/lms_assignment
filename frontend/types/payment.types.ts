export interface Payment {
  id: string;
  loanId: string;
  borrowerId?: string;
  utrNumber: string;
  amount: number;
  paymentDate: string;
  recordedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecordPaymentPayload {
  utrNumber: string;
  amount: number;
  paymentDate: string;
}
