import type { AuthUser, UserRole } from "@/types/user.types";
import type { ApiResponse } from "@/types/api.types";
import type { LoginPayload, SignupPayload, AuthResponseData } from "@/types/auth.types";
import { apiRequest } from "./api";
import { setToken, removeToken } from "./token-storage";

interface RawUser {
  _id?: string;
  id?: string;
  fullName?: string;
  email?: string;
  role: UserRole;
}

function normalizeUser(user: RawUser): AuthUser {
  if (!user) {
    throw new Error("User object is missing");
  }
  const userId = user.id || user._id;
  if (!userId) {
    throw new Error("User ID is missing");
  }
  return {
    id: userId,
    fullName: user.fullName || "",
    email: user.email || "",
    role: user.role,
  };
}

export async function login(payload: LoginPayload): Promise<AuthResponseData> {
  const res = await apiRequest<ApiResponse<{ user: RawUser; token: string }>>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.success || !res.data) {
    throw new Error(res.message || "Login failed");
  }

  const { user, token } = res.data;
  setToken(token);

  return {
    user: normalizeUser(user),
    token,
  };
}

export async function signup(payload: SignupPayload): Promise<AuthResponseData> {
  const res = await apiRequest<ApiResponse<{ user: RawUser; token: string }>>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.success || !res.data) {
    throw new Error(res.message || "Signup failed");
  }

  const { user, token } = res.data;
  if (token) {
    setToken(token);
  }

  return {
    user: normalizeUser(user),
    token: token || "",
  };
}

export async function getCurrentUser(): Promise<AuthUser> {
  const res = await apiRequest<ApiResponse<{ user: RawUser }>>("/auth/me");

  if (!res.success || !res.data?.user) {
    throw new Error(res.message || "Failed to fetch current user");
  }

  return normalizeUser(res.data.user);
}

export function logout(): void {
  removeToken();
}
