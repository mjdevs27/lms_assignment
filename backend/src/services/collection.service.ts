import { FilterQuery, SortOrder } from 'mongoose';
import Loan from '../models/Loan.model';
import { ILoan } from '../types/loan.types';
import { ApiError } from '../utils/ApiError';
import { LOAN_STATUS } from '../constants/loan.constants';
import { getSkip, getTotalPages } from '../utils/pagination.util';
import { CollectionLoanSummary, CollectionLoansQuery, PaginationMeta } from '../types/collection.types';

const ALLOWED_SORT_FIELDS: Record<string, string> = {
  disbursedAt: 'disbursedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  loanAmount: 'loanAmount',
  outstandingAmount: 'outstandingAmount',
  fullName: 'fullName',
};

const sanitizeLoan = (loan: ILoan): CollectionLoanSummary => ({
  id: loan._id.toString(),
  borrowerId: loan.borrowerId.toString(),
  fullName: loan.fullName,
  pan: loan.pan,
  monthlySalary: loan.monthlySalary,
  employmentMode: loan.employmentMode,
  salarySlipUrl: loan.salarySlipUrl,
  loanAmount: loan.loanAmount,
  tenureDays: loan.tenureDays,
  interestRate: loan.interestRate,
  interestAmount: loan.interestAmount,
  totalRepayment: loan.totalRepayment,
  totalPaid: loan.totalPaid,
  outstandingAmount: loan.outstandingAmount,
  status: 'DISBURSED',
  disbursedBy: loan.disbursedBy?.toString(),
  disbursedAt: loan.disbursedAt,
  createdAt: loan.createdAt,
  updatedAt: loan.updatedAt,
});

export const getDisbursedLoans = async (
  query: CollectionLoansQuery,
): Promise<{ loans: CollectionLoanSummary[]; pagination: PaginationMeta }> => {
  const page = Number(query.page ?? 1) || 1;
  const limit = Number(query.limit ?? 10) || 10;
  const sortField = ALLOWED_SORT_FIELDS[String(query.sortBy ?? 'disbursedAt')] ?? 'disbursedAt';
  const sortOrder: SortOrder = String(query.sortOrder ?? 'desc') === 'asc' ? 1 : -1;

  const filter: FilterQuery<ILoan> = { status: LOAN_STATUS.DISBURSED };

  if (query.search && typeof query.search === 'string' && query.search.trim()) {
    const escaped = query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    filter.$or = [{ fullName: regex }, { pan: regex }];
  }

  if (query.minOutstanding !== undefined && query.minOutstanding !== '') {
    const min = Number(query.minOutstanding);
    if (!isNaN(min)) {
      filter.outstandingAmount = { ...((filter.outstandingAmount as object) ?? {}), $gte: min };
    }
  }

  if (query.maxOutstanding !== undefined && query.maxOutstanding !== '') {
    const max = Number(query.maxOutstanding);
    if (!isNaN(max)) {
      filter.outstandingAmount = { ...((filter.outstandingAmount as object) ?? {}), $lte: max };
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

export const getDisbursedLoanById = async (loanId: string): Promise<CollectionLoanSummary> => {
  const loan = await Loan.findById(loanId);

  if (!loan) {
    throw new ApiError(404, 'Loan not found.');
  }

  if (loan.status !== LOAN_STATUS.DISBURSED) {
    throw new ApiError(
      409,
      `Loan is not in DISBURSED state. Current status: ${loan.status}.`,
    );
  }

  return sanitizeLoan(loan);
};
