export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationValidationResult {
  valid: boolean;
  params?: PaginationParams;
  error?: string;
}

export const MAX_PAGE_LIMIT = 100;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const validatePagination = (
  rawPage: unknown,
  rawLimit: unknown,
): PaginationValidationResult => {
  let page = DEFAULT_PAGE;
  let limit = DEFAULT_LIMIT;

  if (rawPage !== undefined && rawPage !== null && rawPage !== '') {
    const parsed = Number(rawPage);
    if (!Number.isInteger(parsed) || parsed < 1) {
      return { valid: false, error: 'page must be a positive integer.' };
    }
    page = parsed;
  }

  if (rawLimit !== undefined && rawLimit !== null && rawLimit !== '') {
    const parsed = Number(rawLimit);
    if (!Number.isInteger(parsed) || parsed < 1) {
      return { valid: false, error: 'limit must be a positive integer.' };
    }
    if (parsed > MAX_PAGE_LIMIT) {
      return { valid: false, error: `limit must not exceed ${MAX_PAGE_LIMIT}.` };
    }
    limit = parsed;
  }

  return { valid: true, params: { page, limit } };
};
