import path from 'path';
import crypto from 'crypto';

/**
 * Allowed MIME types for salary slip upload.
 */
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
];

/**
 * Allowed file extensions for salary slip upload.
 */
export const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];

/**
 * Maximum file size: 5 MB.
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Upload destination directory for salary slips.
 */
export const SALARY_SLIP_DIR = path.join(process.cwd(), 'uploads', 'salary-slips');

/**
 * Generate a safe filename for an uploaded file.
 * Format: borrowerId_timestamp_random.ext
 */
export const generateSafeFilename = (borrowerId: string, originalName: string): string => {
  const ext = path.extname(originalName).toLowerCase();
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  return `${borrowerId}_${timestamp}_${random}${ext}`;
};

/**
 * Check if a MIME type is allowed.
 */
export const isAllowedMimeType = (mimeType: string): boolean => {
  return ALLOWED_MIME_TYPES.includes(mimeType);
};

/**
 * Check if a file extension is allowed.
 */
export const isAllowedExtension = (filename: string): boolean => {
  const ext = path.extname(filename).toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
};
