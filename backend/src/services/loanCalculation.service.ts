import { FIXED_INTEREST_RATE } from '../constants/loan.constants';
import { validateLoanInput, LoanValidationError } from '../validators/loan.validator';
import { calculateSimpleInterest } from '../utils/loanCalculation.util';

export interface LoanQuoteInput {
  loanAmount: unknown;
  tenureDays: unknown;
}

export interface LoanQuoteData {
  loanAmount: number;
  tenureDays: number;
  interestRate: number;
  interestAmount: number;
  totalRepayment: number;
  outstandingAmount: number;
}

export type LoanQuoteResult =
  | { valid: true; data: LoanQuoteData }
  | { valid: false; errors: LoanValidationError[] };

export const calculateLoanQuote = (input: LoanQuoteInput): LoanQuoteResult => {
  const validation = validateLoanInput({
    loanAmount: input.loanAmount,
    tenureDays: input.tenureDays,
  });

  if (!validation.valid) {
    return { valid: false, errors: validation.errors };
  }

  const loanAmount = input.loanAmount as number;
  const tenureDays = input.tenureDays as number;

  const calc = calculateSimpleInterest({
    principal: loanAmount,
    annualRate: FIXED_INTEREST_RATE,
    tenureDays,
  });

  return {
    valid: true,
    data: {
      loanAmount,
      tenureDays,
      interestRate: FIXED_INTEREST_RATE,
      interestAmount: calc.interestAmount,
      totalRepayment: calc.totalRepayment,
      outstandingAmount: calc.totalRepayment,
    },
  };
};
