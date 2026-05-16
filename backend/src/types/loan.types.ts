import { Document, Types } from 'mongoose';
import { LoanStatus } from '../constants/loan.constants';
import { EmploymentMode } from '../constants/employmentModes';

export interface ILoan extends Document {
  _id: Types.ObjectId;
  borrowerId: Types.ObjectId;
  fullName: string;
  pan: string;
  dob: Date;
  monthlySalary: number;
  employmentMode: EmploymentMode;
  salarySlipUrl: string;
  salarySlipOriginalName: string;
  salarySlipMimeType: string;
  salarySlipSize: number;
  loanAmount: number;
  tenureDays: number;
  interestRate: number;
  interestAmount: number;
  totalRepayment: number;
  totalPaid: number;
  outstandingAmount: number;
  status: LoanStatus;
  rejectionReason?: string;
  sanctionedBy?: Types.ObjectId;
  sanctionedAt?: Date;
  sanctionRemarks?: string;
  rejectedBy?: Types.ObjectId;
  rejectedAt?: Date;
  disbursedBy?: Types.ObjectId;
  disbursedAt?: Date;
  disbursementRemarks?: string;
  disbursementReference?: string;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
