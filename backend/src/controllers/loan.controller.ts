import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import {
  getLoanQuote,
  applyForLoan,
  getLatestBorrowerLoan,
  getBorrowerLoans,
} from '../services/loan.service';

export const loanQuote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    const { loanAmount, tenureDays } = req.body;
    const result = getLoanQuote({ loanAmount, tenureDays });

    if (!result.valid) {
      res.status(400).json({
        success: false,
        message: 'Loan quote validation failed.',
        errors: result.errors,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Loan quote calculated successfully.',
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

export const applyLoan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    const { loanAmount, tenureDays } = req.body;
    const loan = await applyForLoan(req.user._id.toString(), { loanAmount, tenureDays });

    res.status(201).json({
      success: true,
      message: 'Loan application submitted successfully.',
      data: { loan },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyLoan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    const loan = await getLatestBorrowerLoan(req.user._id.toString());

    res.status(200).json({
      success: true,
      message: 'Loan fetched successfully.',
      data: { loan },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyLoans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    const loans = await getBorrowerLoans(req.user._id.toString());

    res.status(200).json({
      success: true,
      message: 'Loans fetched successfully.',
      data: { loans },
    });
  } catch (error) {
    next(error);
  }
};
