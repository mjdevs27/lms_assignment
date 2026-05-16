import { Document, Types } from 'mongoose';

export interface IPayment extends Document {
  _id: Types.ObjectId;
  loanId: Types.ObjectId;
  borrowerId: Types.ObjectId;
  utrNumber: string;
  amount: number;
  paymentDate: Date;
  recordedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecordPaymentInput {
  utrNumber: string;
  amount: number;
  paymentDate: string;
}

export interface PaymentQuery {
  page?: unknown;
  limit?: unknown;
  sortBy?: unknown;
  sortOrder?: unknown;
  loanId?: unknown;
}

export interface PaymentSummary {
  id: string;
  loanId: string;
  borrowerId: string;
  utrNumber: string;
  amount: number;
  paymentDate: Date;
  recordedBy: string;
  createdAt: Date;
}
