import mongoose, { Schema } from 'mongoose';
import { IPayment } from '../types/payment.types';

const PaymentSchema = new Schema<IPayment>(
  {
    loanId: {
      type: Schema.Types.ObjectId,
      ref: 'Loan',
      required: [true, 'Loan ID is required'],
    },
    borrowerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Borrower ID is required'],
    },
    utrNumber: {
      type: String,
      required: [true, 'UTR number is required'],
      uppercase: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0.01, 'Payment amount must be greater than 0'],
    },
    paymentDate: {
      type: Date,
      required: [true, 'Payment date is required'],
    },
    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recorded by is required'],
    },
  },
  {
    timestamps: true,
  },
);

PaymentSchema.index({ utrNumber: 1 }, { unique: true });
PaymentSchema.index({ loanId: 1 });
PaymentSchema.index({ borrowerId: 1 });
PaymentSchema.index({ paymentDate: -1 });

const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
