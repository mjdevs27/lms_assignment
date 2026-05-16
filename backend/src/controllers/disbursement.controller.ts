import { Request, Response, NextFunction } from 'express';
import {
  getSanctionedLoans,
  getSanctionedLoanById,
  disburseSanctionedLoan,
} from '../services/disbursement.service';
import {
  validateLoanId,
  validateDisbursementLoanQuery,
  validateDisbursementBody,
} from '../validators/disbursement.validator';
import { validatePagination } from '../validators/pagination.validator';

export const getSanctionedLoansHandler = async (
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

    const queryResult = validateDisbursementLoanQuery(req.query as Record<string, unknown>);
    if (!queryResult.valid) {
      res.status(400).json({ success: false, message: queryResult.error, code: queryResult.code });
      return;
    }

    const { page, limit } = paginationResult.params!;
    const { loans, pagination } = await getSanctionedLoans({
      ...req.query,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      message: 'Sanctioned loans fetched successfully.',
      data: { loans, pagination },
    });
  } catch (error) {
    next(error);
  }
};

export const getSanctionedLoanByIdHandler = async (
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

    const loan = await getSanctionedLoanById(loanId);

    res.status(200).json({
      success: true,
      message: 'Sanctioned loan fetched successfully.',
      data: { loan },
    });
  } catch (error) {
    next(error);
  }
};

export const disburseLoanHandler = async (
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

    const bodyResult = validateDisbursementBody(req.body);
    if (!bodyResult.valid) {
      res.status(400).json({ success: false, message: bodyResult.error, code: bodyResult.code });
      return;
    }

    const actorUserId = req.user!._id.toString();
    const loan = await disburseSanctionedLoan(loanId, actorUserId, {
      remarks: req.body.remarks,
      disbursementReference: req.body.disbursementReference,
    });

    res.status(200).json({
      success: true,
      message: 'Loan disbursed successfully.',
      data: { loan },
    });
  } catch (error) {
    next(error);
  }
};
