import type { UserRole } from "@/types/user.types";

export type DashboardModule = "sales" | "sanction" | "disbursement" | "collection";

export function canAccessBorrowerPortal(role: UserRole): boolean {
  return role === "BORROWER";
}

export function canAccessDashboard(role: UserRole): boolean {
  return ["ADMIN", "SALES", "SANCTION", "DISBURSEMENT", "COLLECTION"].includes(role);
}

export function canAccessDashboardModule(role: UserRole, module: DashboardModule): boolean {
  if (role === "ADMIN") return true;
  if (role === "SALES" && module === "sales") return true;
  if (role === "SANCTION" && module === "sanction") return true;
  if (role === "DISBURSEMENT" && module === "disbursement") return true;
  if (role === "COLLECTION" && module === "collection") return true;
  return false;
}

export function getDashboardModulesForRole(role: UserRole): DashboardModule[] {
  if (role === "ADMIN") return ["sales", "sanction", "disbursement", "collection"];
  if (role === "SALES") return ["sales"];
  if (role === "SANCTION") return ["sanction"];
  if (role === "DISBURSEMENT") return ["disbursement"];
  if (role === "COLLECTION") return ["collection"];
  return [];
}
