import mongoose, { Schema } from 'mongoose';
import { ILoan } from '../types/loan.types';
import { LOAN_STATUS, LOAN_STATUS_VALUES } from '../constants/loan.constants';
import { EMPLOYMENT_MODES } from '../constants/employmentModes';

const LoanSchema = new Schema<ILoan>(
  {
    borrowerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Borrower ID is required'],
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    pan: {
      type: String,
      required: [true, 'PAN is required'],
      uppercase: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    monthlySalary: {
      type: Number,
      required: [true, 'Monthly salary is required'],
      min: [0, 'Monthly salary cannot be negative'],
    },
    employmentMode: {
      type: String,
      required: [true, 'Employment mode is required'],
      enum: {
        values: [EMPLOYMENT_MODES.SALARIED, EMPLOYMENT_MODES.SELF_EMPLOYED],
        message: 'Invalid employment mode: {VALUE}',
      },
    },
    salarySlipUrl: {
      type: String,
      required: [true, 'Salary slip URL is required'],
    },
    salarySlipOriginalName: {
      type: String,
      required: [true, 'Salary slip original name is required'],
    },
    salarySlipMimeType: {
      type: String,
      required: [true, 'Salary slip MIME type is required'],
    },
    salarySlipSize: {
      type: Number,
      required: [true, 'Salary slip size is required'],
    },
    loanAmount: {
      type: Number,
      required: [true, 'Loan amount is required'],
      min: [50000, 'Loan amount must be at least 50000'],
      max: [500000, 'Loan amount must not exceed 500000'],
    },
    tenureDays: {
      type: Number,
      required: [true, 'Tenure is required'],
      min: [30, 'Tenure must be at least 30 days'],
      max: [365, 'Tenure must not exceed 365 days'],
    },
    interestRate: {
      type: Number,
      required: true,
      default: 12,
    },
    interestAmount: {
      type: Number,
      required: [true, 'Interest amount is required'],
    },
    totalRepayment: {
      type: Number,
      required: [true, 'Total repayment is required'],
    },
    totalPaid: {
      type: Number,
      required: true,
      default: 0,
    },
    outstandingAmount: {
      type: Number,
      required: [true, 'Outstanding amount is required'],
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: LOAN_STATUS_VALUES,
        message: 'Invalid loan status: {VALUE}',
      },
      default: LOAN_STATUS.APPLIED,
    },
    rejectionReason: {
      type: String,
    },
    sanctionedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    sanctionedAt: {
      type: Date,
    },
    sanctionRemarks: {
      type: String,
    },
    rejectedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectedAt: {
      type: Date,
    },
    disbursedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    disbursedAt: {
      type: Date,
    },
    disbursementRemarks: {
      type: String,
    },
    disbursementReference: {
      type: String,
    },
    closedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

LoanSchema.index({ borrowerId: 1 });
LoanSchema.index({ status: 1 });
LoanSchema.index({ createdAt: -1 });
LoanSchema.index({ pan: 1 });
LoanSchema.index({ borrowerId: 1, status: 1 });

const Loan = mongoose.model<ILoan>('Loan', LoanSchema);

export default Loan;
