import { Request, Response, NextFunction } from 'express';
import { getDisbursedLoans, getDisbursedLoanById } from '../services/collection.service';
import {
  recordLoanPayment,
  getPaymentsForLoan,
  getPaymentsForBorrower,
} from '../services/payment.service';
import {
  validateLoanId,
  validateCollectionLoanQuery,
  validateRecordPaymentBody,
  validatePaymentQuery,
} from '../validators/payment.validator';
import { validatePagination } from '../validators/pagination.validator';
import Loan from '../models/Loan.model';
import { LOAN_STATUS } from '../constants/loan.constants';

export const getDisbursedLoansHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const paginationResult = validatePagination(req.query.page, req.query.limit);
    if (!paginationResult.valid) {
      res.status(400).json({ success: false, message: paginationResult.error });
      return;
    }

    const queryResult = validateCollectionLoanQuery(req.query as Record<string, unknown>);
    if (!queryResult.valid) {
      res.status(400).json({ success: false, message: queryResult.error, code: queryResult.code });
      return;
    }

    const { page, limit } = paginationResult.params!;
    const { loans, pagination } = await getDisbursedLoans({
      ...req.query,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      message: 'Disbursed loans fetched successfully.',
      data: { loans, pagination },
    });
  } catch (error) {
    next(error);
  }
};

export const getDisbursedLoanByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const loanId = String(req.params['loanId']);
    const idResult = validateLoanId(loanId);
    if (!idResult.valid) {
      res.status(400).json({ success: false, message: idResult.error, code: idResult.code });
      return;
    }

    const loan = await getDisbursedLoanById(loanId);

    res.status(200).json({
      success: true,
      message: 'Disbursed loan fetched successfully.',
      data: { loan },
    });
  } catch (error) {
    next(error);
  }
};

export const recordPaymentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const loanId = String(req.params['loanId']);
    const idResult = validateLoanId(loanId);
    if (!idResult.valid) {
      res.status(400).json({ success: false, message: idResult.error, code: idResult.code });
      return;
    }

    const bodyValidation = validateRecordPaymentBody(req.body);
    if (!bodyValidation.valid) {
      res.status(400).json({
        success: false,
        message: bodyValidation.error,
        code: bodyValidation.code,
      });
      return;
    }

    const loan = await Loan.findById(loanId);
    if (loan && loan.status === LOAN_STATUS.DISBURSED) {
      const amountCheck = validateRecordPaymentBody(req.body, loan.outstandingAmount);
      if (!amountCheck.valid) {
        const statusCode = amountCheck.code === 'AMOUNT_EXCEEDS_OUTSTANDING' ? 400 : 400;
        res.status(statusCode).json({
          success: false,
          message: amountCheck.error,
          code: amountCheck.code,
        });
        return;
      }
    }

    const actorUserId = req.user!._id.toString();
    const result = await recordLoanPayment(loanId, actorUserId, {
      utrNumber: req.body.utrNumber,
      amount: Number(req.body.amount),
      paymentDate: req.body.paymentDate,
    });

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        payment: result.payment,
        loan: result.loan,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLoanPaymentsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const loanId = String(req.params['loanId']);
    const idResult = validateLoanId(loanId);
    if (!idResult.valid) {
      res.status(400).json({ success: false, message: idResult.error, code: idResult.code });
      return;
    }

    const paginationResult = validatePagination(req.query.page, req.query.limit);
    if (!paginationResult.valid) {
      res.status(400).json({ success: false, message: paginationResult.error });
      return;
    }

    const queryResult = validatePaymentQuery(req.query as Record<string, unknown>);
    if (!queryResult.valid) {
      res.status(400).json({ success: false, message: queryResult.error, code: queryResult.code });
      return;
    }

    const { page, limit } = paginationResult.params!;
    const { payments, pagination } = await getPaymentsForLoan(loanId, {
      ...req.query,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      message: 'Loan payments fetched successfully.',
      data: { payments, pagination },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyPaymentsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const borrowerId = req.user!._id.toString();

    const paginationResult = validatePagination(req.query.page, req.query.limit);
    if (!paginationResult.valid) {
      res.status(400).json({ success: false, message: paginationResult.error });
      return;
    }

    const queryResult = validatePaymentQuery(req.query as Record<string, unknown>);
    if (!queryResult.valid) {
      res.status(400).json({ success: false, message: queryResult.error, code: queryResult.code });
      return;
    }

    const { page, limit } = paginationResult.params!;
    const { payments, pagination } = await getPaymentsForBorrower(borrowerId, {
      ...req.query,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      message: 'Your payments fetched successfully.',
      data: { payments, pagination },
    });
  } catch (error) {
    next(error);
  }
};
