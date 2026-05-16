import type { AuthUser } from "./user.types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponseData {
  user: AuthUser;
  token: string;
}
