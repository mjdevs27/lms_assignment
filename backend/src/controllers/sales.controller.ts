import { Request, Response, NextFunction } from 'express';
import { getSalesLeads, getSalesLeadById } from '../services/sales.service';
import { validatePagination } from '../validators/pagination.validator';

export const listSalesLeads = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const paginationResult = validatePagination(req.query.page, req.query.limit);
    if (!paginationResult.valid) {
      res.status(400).json({
        success: false,
        message: paginationResult.error ?? 'Invalid pagination parameters.',
      });
      return;
    }

    const { page, limit } = paginationResult.params!;

    const { leads, pagination } = await getSalesLeads({
      page,
      limit,
      search: req.query.search,
      profileStatus: req.query.profileStatus,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    });

    res.status(200).json({
      success: true,
      message: 'Sales leads fetched successfully.',
      data: { leads, pagination },
    });
  } catch (error) {
    next(error);
  }
};

export const getSalesLeadDetail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const borrowerId = String(req.params['borrowerId']);
    const lead = await getSalesLeadById(borrowerId);

    res.status(200).json({
      success: true,
      message: 'Sales lead fetched successfully.',
      data: { lead },
    });
  } catch (error) {
    next(error);
  }
};
