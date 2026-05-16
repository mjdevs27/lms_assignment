import { Request, Response, NextFunction } from 'express';
import { processSalarySlipUpload } from '../services/upload.service';
import { ApiError } from '../utils/ApiError';

/**
 * POST /api/borrower/upload-salary-slip
 * Handle salary slip file upload.
 */
export const uploadSalarySlip = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required');
    }

    if (!req.file) {
      throw new ApiError(400, 'No file uploaded. Please attach a salary slip.');
    }

    const result = await processSalarySlipUpload(req.user, req.file);

    res.status(200).json({
      success: true,
      message: 'Salary slip uploaded successfully.',
      data: {
        salarySlip: {
          url: result.url,
          originalName: result.originalName,
          mimeType: result.mimeType,
          size: result.size,
        },
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    // Handle multer errors
    if (error instanceof Error && error.message.includes('File too large')) {
      res.status(400).json({
        success: false,
        message: 'File size exceeds the maximum limit of 5 MB.',
      });
      return;
    }

    if (error instanceof Error && error.message.includes('Invalid file type')) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    next(error);
  }
};
