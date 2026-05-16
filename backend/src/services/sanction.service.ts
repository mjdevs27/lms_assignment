import mongoose, { FilterQuery, SortOrder } from 'mongoose';
import Loan from '../models/Loan.model';
import { ILoan } from '../types/loan.types';
import { ApiError } from '../utils/ApiError';
import { LOAN_STATUS } from '../constants/loan.constants';
import { getSkip, getTotalPages } from '../utils/pagination.util';
import {
  SanctionLoanSummary,
  SanctionLoansQuery,
  ApproveLoanInput,
  RejectLoanInput,
  PaginationMeta,
} from '../types/sanction.types';

const ALLOWED_SORT_FIELDS: Record<string, string> = {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  loanAmount: 'loanAmount',
  fullName: 'fullName',
};

const sanitizeLoan = (loan: ILoan): SanctionLoanSummary => ({
  id: loan._id.toString(),
  borrowerId: loan.borrowerId.toString(),
  fullName: loan.fullName,
  pan: loan.pan,
  dob: loan.dob,
  monthlySalary: loan.monthlySalary,
  employmentMode: loan.employmentMode,
  salarySlipUrl: loan.salarySlipUrl,
  loanAmount: loan.loanAmount,
  tenureDays: loan.tenureDays,
  interestRate: loan.interestRate,
  interestAmount: loan.interestAmount,
  totalRepayment: loan.totalRepayment,
  outstandingAmount: loan.outstandingAmount,
  status: 'APPLIED',
  createdAt: loan.createdAt,
  updatedAt: loan.updatedAt,
});

export const getAppliedLoans = async (
  query: SanctionLoansQuery,
): Promise<{ loans: SanctionLoanSummary[]; pagination: PaginationMeta }> => {
  const page = Number(query.page ?? 1) || 1;
  const limit = Number(query.limit ?? 10) || 10;
  const sortField = ALLOWED_SORT_FIELDS[String(query.sortBy ?? 'createdAt')] ?? 'createdAt';
  const sortOrder: SortOrder = String(query.sortOrder ?? 'desc') === 'asc' ? 1 : -1;

  const filter: FilterQuery<ILoan> = { status: LOAN_STATUS.APPLIED };

  if (query.search && typeof query.search === 'string' && query.search.trim()) {
    const escaped = query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    filter.$or = [{ fullName: regex }, { pan: regex }];
  }

  if (query.employmentMode && typeof query.employmentMode === 'string' && query.employmentMode.trim()) {
    filter.employmentMode = query.employmentMode.trim().toUpperCase();
  }

  if (query.minAmount !== undefined && query.minAmount !== '') {
    const min = Number(query.minAmount);
    if (!isNaN(min)) {
      filter.loanAmount = { ...((filter.loanAmount as object) ?? {}), $gte: min };
    }
  }

  if (query.maxAmount !== undefined && query.maxAmount !== '') {
    const max = Number(query.maxAmount);
    if (!isNaN(max)) {
      filter.loanAmount = { ...((filter.loanAmount as object) ?? {}), $lte: max };
    }
  }

  const total = await Loan.countDocuments(filter);
  const skip = getSkip(page, limit);

  const loans = await Loan.find(filter)
    .sort({ [sortField]: sortOrder })
    .skip(skip)
    .limit(limit);

  return {
    loans: loans.map(sanitizeLoan),
    pagination: {
      page,
      limit,
      total,
      totalPages: getTotalPages(total, limit),
    },
  };
};

export const getAppliedLoanById = async (loanId: string): Promise<SanctionLoanSummary> => {
  const loan = await Loan.findById(loanId);

  if (!loan) {
    throw new ApiError(404, 'Loan not found.');
  }

  if (loan.status !== LOAN_STATUS.APPLIED) {
    throw new ApiError(
      409,
      `Loan is not in APPLIED state. Current status: ${loan.status}.`,
    );
  }

  return sanitizeLoan(loan);
};

export const approveAppliedLoan = async (
  loanId: string,
  actorUserId: string,
  input: ApproveLoanInput,
): Promise<{ id: string; status: string }> => {
  const updated = await Loan.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(loanId), status: LOAN_STATUS.APPLIED },
    {
      $set: {
        status: LOAN_STATUS.SANCTIONED,
        sanctionedBy: new mongoose.Types.ObjectId(actorUserId),
        sanctionedAt: new Date(),
        ...(input.remarks ? { sanctionRemarks: input.remarks } : {}),
      },
    },
    { new: true },
  );

  if (!updated) {
    const existing = await Loan.findById(loanId);
    if (!existing) {
      throw new ApiError(404, 'Loan not found.');
    }
    throw new ApiError(
      409,
      `Loan cannot be approved. Current status: ${existing.status}.`,
    );
  }

  return {
    id: updated._id.toString(),
    status: updated.status,
  };
};

export const rejectAppliedLoan = async (
  loanId: string,
  actorUserId: string,
  input: RejectLoanInput,
): Promise<{ id: string; status: string; rejectionReason: string }> => {
  const updated = await Loan.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(loanId), status: LOAN_STATUS.APPLIED },
    {
      $set: {
        status: LOAN_STATUS.REJECTED,
        rejectionReason: input.reason,
        rejectedBy: new mongoose.Types.ObjectId(actorUserId),
        rejectedAt: new Date(),
      },
    },
    { new: true },
  );

  if (!updated) {
    const existing = await Loan.findById(loanId);
    if (!existing) {
      throw new ApiError(404, 'Loan not found.');
    }
    throw new ApiError(
      409,
      `Loan cannot be rejected. Current status: ${existing.status}.`,
    );
  }

  return {
    id: updated._id.toString(),
    status: updated.status,
    rejectionReason: updated.rejectionReason ?? input.reason,
  };
};
