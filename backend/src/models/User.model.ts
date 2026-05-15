import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types/user.types';
import { USER_ROLE_VALUES, USER_ROLES } from '../constants/roles';
import { EMPLOYMENT_MODE_VALUES } from '../constants/employmentModes';
import { isValidEmail, isValidPan } from '../validators/user.validator';

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name must not exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: isValidEmail,
        message: 'Please provide a valid email address',
      },
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    role: {
      type: String,
      required: true,
      enum: {
        values: USER_ROLE_VALUES,
        message: 'Invalid role: {VALUE}',
      },
      default: USER_ROLES.BORROWER,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    pan: {
      type: String,
      uppercase: true,
      trim: true,
      validate: {
        validator: function (value: string) {
          // Only validate if a value is provided
          if (!value) return true;
          return isValidPan(value);
        },
        message: 'PAN must follow format: ABCDE1234F',
      },
    },
    dob: {
      type: Date,
    },
    monthlySalary: {
      type: Number,
      min: [0, 'Monthly salary cannot be negative'],
    },
    employmentMode: {
      type: String,
      enum: {
        values: EMPLOYMENT_MODE_VALUES,
        message: 'Invalid employment mode: {VALUE}',
      },
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    eligibilityStatus: {
      type: String,
      enum: ['ELIGIBLE', 'NOT_ELIGIBLE', 'PENDING'],
      default: 'PENDING',
    },
    eligibilityCheckedAt: {
      type: Date,
    },
    salarySlipUrl: {
      type: String,
    },
    salarySlipOriginalName: {
      type: String,
    },
    salarySlipMimeType: {
      type: String,
    },
    salarySlipSize: {
      type: Number,
    },
    salarySlipUploadedAt: {
      type: Date,
    },
    salarySlipStoragePath: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

// ---------------------------------------------------------------------------
// Security: strip passwordHash from JSON and object outputs
// ---------------------------------------------------------------------------
UserSchema.set('toJSON', {
  transform: (_doc: any, ret: any) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

UserSchema.set('toObject', {
  transform: (_doc: any, ret: any) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
