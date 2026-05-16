import User from '../models/User.model';
import Loan from '../models/Loan.model';
import { ILoan } from '../types/loan.types';
import { LoanApplicationInput } from '../types/loanApplication.types';
import { LoanQuoteResult, calculateLoanQuote } from './loanCalculation.service';
import { runEligibilityCheck } from './bre.service';
import { FIXED_INTEREST_RATE, LOAN_STATUS, ACTIVE_LOAN_STATUSES } from '../constants/loan.constants';
import { ApiError } from '../utils/ApiError';

export const getLoanQuote = (input: LoanApplicationInput): LoanQuoteResult => {
  return calculateLoanQuote({ loanAmount: input.loanAmount, tenureDays: input.tenureDays });
};

export const hasActiveLoan = async (borrowerId: string): Promise<boolean> => {
  const count = await Loan.countDocuments({
    borrowerId,
    status: { $in: ACTIVE_LOAN_STATUSES },
  });
  return count > 0;
};

export const applyForLoan = async (
  borrowerId: string,
  input: LoanApplicationInput,
): Promise<ILoan> => {
  const user = await User.findById(borrowerId);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  if (!user.isProfileComplete) {
    throw new ApiError(400, 'Borrower profile must be completed before applying for a loan.');
  }

  if (
    !user.fullName ||
    !user.pan ||
    !user.dob ||
    user.monthlySalary === undefined ||
    !user.employmentMode
  ) {
    throw new ApiError(400, 'Borrower profile must be completed before applying for a loan.');
  }

  const breResult = runEligibilityCheck({
    pan: user.pan,
    dob: user.dob,
    monthlySalary: user.monthlySalary,
    employmentMode: user.employmentMode,
  });

  if (!breResult.eligible) {
    throw new ApiError(400, 'Borrower does not meet eligibility requirements.');
  }

  if (!user.salarySlipUrl) {
    throw new ApiError(400, 'Salary slip must be uploaded before applying for a loan.');
  }

  const active = await hasActiveLoan(borrowerId);
  if (active) {
    throw new ApiError(409, 'An active loan application already exists for this borrower.');
  }

  const quoteResult = calculateLoanQuote({
    loanAmount: input.loanAmount,
    tenureDays: input.tenureDays,
  });

  if (!quoteResult.valid) {
    throw new ApiError(400, 'Invalid loan parameters.');
  }

  const { data } = quoteResult;

  const loan = await Loan.create({
    borrowerId: user._id,
    fullName: user.fullName,
    pan: user.pan,
    dob: user.dob,
    monthlySalary: user.monthlySalary,
    employmentMode: user.employmentMode,
    salarySlipUrl: user.salarySlipUrl,
    salarySlipOriginalName: user.salarySlipOriginalName ?? '',
    salarySlipMimeType: user.salarySlipMimeType ?? '',
    salarySlipSize: user.salarySlipSize ?? 0,
    loanAmount: data.loanAmount,
    tenureDays: data.tenureDays,
    interestRate: FIXED_INTEREST_RATE,
    interestAmount: data.interestAmount,
    totalRepayment: data.totalRepayment,
    totalPaid: 0,
    outstandingAmount: data.totalRepayment,
    status: LOAN_STATUS.APPLIED,
  });

  return loan;
};

export const getLatestBorrowerLoan = async (borrowerId: string): Promise<ILoan> => {
  const loan = await Loan.findOne({ borrowerId }).sort({ createdAt: -1 });
  if (!loan) {
    throw new ApiError(404, 'No loan application found for this borrower.');
  }
  return loan;
};

export const getBorrowerLoans = async (borrowerId: string): Promise<ILoan[]> => {
  return Loan.find({ borrowerId }).sort({ createdAt: -1 });
};
