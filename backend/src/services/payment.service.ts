import mongoose from 'mongoose';
import Payment from '../models/Payment.model';
import Loan from '../models/Loan.model';
import { ApiError } from '../utils/ApiError';
import { LOAN_STATUS } from '../constants/loan.constants';
import { RecordPaymentInput, PaymentSummary, PaymentQuery } from '../types/payment.types';
import { getSkip, getTotalPages } from '../utils/pagination.util';

const CLOSURE_TOLERANCE = 0.01;

export const roundMoney = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

export const recordLoanPayment = async (
  loanId: string,
  actorUserId: string,
  input: RecordPaymentInput,
): Promise<{
  payment: PaymentSummary;
  loan: {
    id: string;
    status: string;
    totalPaid: number;
    outstandingAmount: number;
    closedAt?: Date;
  };
  message: string;
}> => {
  const loan = await Loan.findById(loanId);

  if (!loan) {
    throw new ApiError(404, 'Loan not found.');
  }

  if (loan.status === LOAN_STATUS.CLOSED) {
    throw new ApiError(409, 'Loan is already closed. No further payments can be recorded.');
  }

  if (loan.status !== LOAN_STATUS.DISBURSED) {
    throw new ApiError(
      409,
      `Payment can only be recorded on a disbursed loan. Current status: ${loan.status}.`,
    );
  }

  const amount = roundMoney(Number(input.amount));

  if (amount > roundMoney(loan.outstandingAmount) + CLOSURE_TOLERANCE) {
    throw new ApiError(
      400,
      `Payment amount ${amount} exceeds outstanding amount ${loan.outstandingAmount}.`,
    );
  }

  const normalizedUtr = input.utrNumber.trim().toUpperCase();

  const existingPayment = await Payment.findOne({ utrNumber: normalizedUtr });
  if (existingPayment) {
    throw new ApiError(409, `UTR number ${normalizedUtr} already exists.`);
  }

  const payment = await Payment.create({
    loanId: new mongoose.Types.ObjectId(loanId),
    borrowerId: loan.borrowerId,
    utrNumber: normalizedUtr,
    amount,
    paymentDate: new Date(input.paymentDate),
    recordedBy: new mongoose.Types.ObjectId(actorUserId),
  });

  const newTotalPaid = roundMoney(loan.totalPaid + amount);
  const newOutstanding = roundMoney(loan.totalRepayment - newTotalPaid);
  const isClosed = newOutstanding <= CLOSURE_TOLERANCE;

  const loanUpdate: Record<string, unknown> = {
    totalPaid: newTotalPaid,
    outstandingAmount: isClosed ? 0 : newOutstanding,
  };

  if (isClosed) {
    loanUpdate.status = LOAN_STATUS.CLOSED;
    loanUpdate.closedAt = new Date();
  }

  const updatedLoan = await Loan.findByIdAndUpdate(
    loanId,
    { $set: loanUpdate },
    { new: true },
  );

  if (!updatedLoan) {
    throw new ApiError(500, 'Failed to update loan after payment.');
  }

  const paymentSummary: PaymentSummary = {
    id: payment._id.toString(),
    loanId: payment.loanId.toString(),
    borrowerId: payment.borrowerId.toString(),
    utrNumber: payment.utrNumber,
    amount: payment.amount,
    paymentDate: payment.paymentDate,
    recordedBy: payment.recordedBy.toString(),
    createdAt: payment.createdAt,
  };

  const loanSummary: {
    id: string;
    status: string;
    totalPaid: number;
    outstandingAmount: number;
    closedAt?: Date;
  } = {
    id: updatedLoan._id.toString(),
    status: updatedLoan.status,
    totalPaid: updatedLoan.totalPaid,
    outstandingAmount: updatedLoan.outstandingAmount,
  };

  if (isClosed && updatedLoan.closedAt) {
    loanSummary.closedAt = updatedLoan.closedAt;
  }

  const message = isClosed
    ? 'Payment recorded successfully. Loan closed.'
    : 'Payment recorded successfully.';

  return { payment: paymentSummary, loan: loanSummary, message };
};

export const getPaymentsForLoan = async (
  loanId: string,
  query: PaymentQuery,
): Promise<{
  payments: PaymentSummary[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> => {
  const loan = await Loan.findById(loanId);
  if (!loan) {
    throw new ApiError(404, 'Loan not found.');
  }

  const page = Number(query.page ?? 1) || 1;
  const limit = Number(query.limit ?? 10) || 10;
  const sortField = query.sortBy === 'paymentDate' ? 'paymentDate' : 'createdAt';
  const sortOrder = String(query.sortOrder ?? 'desc') === 'asc' ? 1 : -1;

  const filter = { loanId: new mongoose.Types.ObjectId(loanId) };
  const total = await Payment.countDocuments(filter);
  const skip = getSkip(page, limit);

  const payments = await Payment.find(filter)
    .sort({ [sortField]: sortOrder })
    .skip(skip)
    .limit(limit);

  return {
    payments: payments.map((p) => ({
      id: p._id.toString(),
      loanId: p.loanId.toString(),
      borrowerId: p.borrowerId.toString(),
      utrNumber: p.utrNumber,
      amount: p.amount,
      paymentDate: p.paymentDate,
      recordedBy: p.recordedBy.toString(),
      createdAt: p.createdAt,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: getTotalPages(total, limit),
    },
  };
};

export const getPaymentsForBorrower = async (
  borrowerId: string,
  query: PaymentQuery,
): Promise<{
  payments: PaymentSummary[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> => {
  const page = Number(query.page ?? 1) || 1;
  const limit = Number(query.limit ?? 10) || 10;
  const sortField = query.sortBy === 'paymentDate' ? 'paymentDate' : 'createdAt';
  const sortOrder = String(query.sortOrder ?? 'desc') === 'asc' ? 1 : -1;

  const filter: Record<string, unknown> = {
    borrowerId: new mongoose.Types.ObjectId(borrowerId),
  };

  if (query.loanId && mongoose.Types.ObjectId.isValid(String(query.loanId))) {
    filter.loanId = new mongoose.Types.ObjectId(String(query.loanId));
  }

  const total = await Payment.countDocuments(filter);
  const skip = getSkip(page, limit);

  const payments = await Payment.find(filter)
    .sort({ [sortField]: sortOrder })
    .skip(skip)
    .limit(limit);

  return {
    payments: payments.map((p) => ({
      id: p._id.toString(),
      loanId: p.loanId.toString(),
      borrowerId: p.borrowerId.toString(),
      utrNumber: p.utrNumber,
      amount: p.amount,
      paymentDate: p.paymentDate,
      recordedBy: p.recordedBy.toString(),
      createdAt: p.createdAt,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: getTotalPages(total, limit),
    },
  };
};
