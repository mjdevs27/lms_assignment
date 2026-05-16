export interface SalesLead {
  id: string;
  fullName: string;
  email: string;
  pan?: string;
  dob?: Date;
  monthlySalary?: number;
  employmentMode?: string;
  isProfileComplete: boolean;
  salarySlipUploaded: boolean;
  salarySlipUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SalesLeadsQuery {
  page?: unknown;
  limit?: unknown;
  search?: unknown;
  profileStatus?: unknown;
  sortBy?: unknown;
  sortOrder?: unknown;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
