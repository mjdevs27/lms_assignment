import { Request, Response, NextFunction } from 'express';
import {
  getAppliedLoans,
  getAppliedLoanById,
  approveAppliedLoan,
  rejectAppliedLoan,
} from '../services/sanction.service';
import {
  validateLoanId,
  validateSanctionLoanQuery,
  validateApproveLoanBody,
  validateRejectLoanBody,
} from '../validators/sanction.validator';
import { validatePagination } from '../validators/pagination.validator';

export const getAppliedLoansHandler = async (
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

    const queryResult = validateSanctionLoanQuery(req.query as Record<string, unknown>);
    if (!queryResult.valid) {
      res.status(400).json({ success: false, message: queryResult.error, code: queryResult.code });
      return;
    }

    const { page, limit } = paginationResult.params!;
    const { loans, pagination } = await getAppliedLoans({
      ...req.query,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      message: 'Applied loans fetched successfully.',
      data: { loans, pagination },
    });
  } catch (error) {
    next(error);
  }
};

export const getAppliedLoanByIdHandler = async (
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

    const loan = await getAppliedLoanById(loanId);

    res.status(200).json({
      success: true,
      message: 'Applied loan fetched successfully.',
      data: { loan },
    });
  } catch (error) {
    next(error);
  }
};

export const approveLoanHandler = async (
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

    const bodyResult = validateApproveLoanBody(req.body);
    if (!bodyResult.valid) {
      res.status(400).json({ success: false, message: bodyResult.error, code: bodyResult.code });
      return;
    }

    const actorUserId = req.user!._id.toString();
    const loan = await approveAppliedLoan(loanId, actorUserId, { remarks: req.body.remarks });

    res.status(200).json({
      success: true,
      message: 'Loan sanctioned successfully.',
      data: { loan },
    });
  } catch (error) {
    next(error);
  }
};

export const rejectLoanHandler = async (
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

    const bodyResult = validateRejectLoanBody(req.body);
    if (!bodyResult.valid) {
      res.status(400).json({ success: false, message: bodyResult.error, code: bodyResult.code });
      return;
    }

    const actorUserId = req.user!._id.toString();
    const loan = await rejectAppliedLoan(loanId, actorUserId, { reason: req.body.reason });

    res.status(200).json({
      success: true,
      message: 'Loan rejected successfully.',
      data: { loan },
    });
  } catch (error) {
    next(error);
  }
};
