import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { SALARY_SLIP_DIR, MAX_FILE_SIZE, ALLOWED_MIME_TYPES, ALLOWED_EXTENSIONS } from '../utils/file.util';

// Ensure the upload directory exists
if (!fs.existsSync(SALARY_SLIP_DIR)) {
  fs.mkdirSync(SALARY_SLIP_DIR, { recursive: true });
}

/**
 * Multer disk storage configuration.
 * Files are temporarily stored with a random name; the controller will rename later.
 */
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, SALARY_SLIP_DIR);
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    // Temporary filename; will be renamed by the service layer
    const ext = path.extname(file.originalname).toLowerCase();
    const tempName = `tmp_${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, tempName);
  },
});

/**
 * File filter: reject files with invalid MIME type or extension.
 */
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype) || !ALLOWED_EXTENSIONS.includes(ext)) {
    cb(new Error('Invalid file type. Allowed: PDF, JPG, JPEG, PNG.'));
    return;
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

/**
 * Middleware for single salary slip upload.
 * Field name: salarySlip
 */
export const uploadSingleSalarySlip = upload.single('salarySlip');
