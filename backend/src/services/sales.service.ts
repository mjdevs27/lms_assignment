import User from '../models/User.model';
import Loan from '../models/Loan.model';
import { IUser } from '../types/user.types';
import { SalesLead, SalesLeadsQuery, PaginationMeta } from '../types/sales.types';
import { ApiError } from '../utils/ApiError';
import { USER_ROLES } from '../constants/roles';
import { getSkip, getTotalPages } from '../utils/pagination.util';
import { FilterQuery, SortOrder } from 'mongoose';

const ALLOWED_SORT_FIELDS: Record<string, string> = {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  fullName: 'fullName',
  monthlySalary: 'monthlySalary',
};

const sanitizeSalesLead = (user: IUser, includeSlipUrl = false): SalesLead => {
  const lead: SalesLead = {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    pan: user.pan,
    dob: user.dob,
    monthlySalary: user.monthlySalary,
    employmentMode: user.employmentMode,
    isProfileComplete: user.isProfileComplete ?? false,
    salarySlipUploaded: !!user.salarySlipUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  if (includeSlipUrl) {
    lead.salarySlipUrl = user.salarySlipUrl;
  }

  return lead;
};

export const getSalesLeads = async (
  query: SalesLeadsQuery,
): Promise<{ leads: SalesLead[]; pagination: PaginationMeta }> => {
  const page = typeof query.page === 'number' ? query.page : 1;
  const limit = typeof query.limit === 'number' ? query.limit : 10;

  const sortField = ALLOWED_SORT_FIELDS[String(query.sortBy ?? 'createdAt')] ?? 'createdAt';
  const sortOrder: SortOrder = String(query.sortOrder ?? 'desc') === 'asc' ? 1 : -1;

  const borrowerIdsWithLoans = await Loan.distinct('borrowerId');

  const filter: FilterQuery<IUser> = {
    role: USER_ROLES.BORROWER,
    _id: { $nin: borrowerIdsWithLoans },
  };

  if (query.search && typeof query.search === 'string' && query.search.trim()) {
    const escaped = query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    filter.$or = [{ fullName: regex }, { email: regex }, { pan: regex }];
  }

  if (query.profileStatus === 'complete') {
    filter.isProfileComplete = true;
  } else if (query.profileStatus === 'incomplete') {
    filter.isProfileComplete = { $ne: true };
  }

  const total = await User.countDocuments(filter);
  const skip = getSkip(page, limit);

  const users = await User.find(filter)
    .sort({ [sortField]: sortOrder })
    .skip(skip)
    .limit(limit);

  return {
    leads: users.map((u) => sanitizeSalesLead(u, false)),
    pagination: {
      page,
      limit,
      total,
      totalPages: getTotalPages(total, limit),
    },
  };
};

export const getSalesLeadById = async (borrowerId: string): Promise<SalesLead> => {
  const user = await User.findById(borrowerId);

  if (!user || user.role !== USER_ROLES.BORROWER) {
    throw new ApiError(404, 'Sales lead not found.');
  }

  const loanCount = await Loan.countDocuments({ borrowerId: user._id });
  if (loanCount > 0) {
    throw new ApiError(404, 'Sales lead not found.');
  }

  return sanitizeSalesLead(user, true);
};
