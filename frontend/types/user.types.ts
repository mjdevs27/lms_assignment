export type UserRole =
  | "ADMIN"
  | "SALES"
  | "SANCTION"
  | "DISBURSEMENT"
  | "COLLECTION"
  | "BORROWER";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}
