import type { ApiResponse } from "@/types/api.types";
import type { UserRole } from "@/types/user.types";
import { apiRequest } from "./api";

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateStaffUserPayload {
  fullName: string;
  email: string;
  password: string;
  role: Exclude<UserRole, "BORROWER">;
}

function normalizeAdminUser(raw: Record<string, unknown>): AdminUser {
  return {
    id: (raw.id as string) || (raw._id as string) || "",
    fullName: (raw.fullName as string) || "",
    email: (raw.email as string) || "",
    role: (raw.role as UserRole) || "BORROWER",
    isActive: typeof raw.isActive === "boolean" ? raw.isActive : true,
    createdAt: raw.createdAt as string | undefined,
  };
}

export async function getAdminUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}): Promise<AdminUsersResponse> {
  let qs = "";
  if (params) {
    const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== "");
    if (entries.length > 0) {
      qs = "?" + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join("&");
    }
  }

  const res = await apiRequest<
    ApiResponse<{
      users: Record<string, unknown>[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  >(`/admin/users${qs}`);

  if (!res.success || !res.data) throw new Error(res.message || "Failed to fetch users");

  return {
    users: res.data.users.map(normalizeAdminUser),
    total: res.data.total,
    page: res.data.page,
    limit: res.data.limit,
    totalPages: res.data.totalPages,
  };
}

export async function createAdminUser(payload: CreateStaffUserPayload): Promise<AdminUser> {
  const res = await apiRequest<ApiResponse<{ user: Record<string, unknown> }>>("/admin/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.success || !res.data?.user) throw new Error(res.message || "Failed to create user");
  return normalizeAdminUser(res.data.user);
}

export async function toggleAdminUserActive(userId: string): Promise<AdminUser> {
  const res = await apiRequest<ApiResponse<{ user: Record<string, unknown> }>>(
    `/admin/users/${userId}/toggle-active`,
    { method: "PATCH" }
  );
  if (!res.success || !res.data?.user) throw new Error(res.message || "Failed to update user");
  return normalizeAdminUser(res.data.user);
}
