export const getSkip = (page: number, limit: number): number => (page - 1) * limit;

export const getTotalPages = (total: number, limit: number): number =>
  Math.ceil(total / limit);
