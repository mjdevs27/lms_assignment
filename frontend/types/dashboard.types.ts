export interface DashboardQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  minAmount?: number;
  maxAmount?: number;
  employmentMode?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface SalesLead {
  id: string;
  fullName: string;
  email: string;
  pan?: string;
  dob?: string;
  monthlySalary?: number;
  employmentMode?: string;
  isProfileComplete?: boolean;
  salarySlipUploaded?: boolean;
  salarySlipUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
