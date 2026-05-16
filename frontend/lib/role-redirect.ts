import type { UserRole } from "@/types/user.types";
import { ROUTES } from "@/constants/routes.constants";

export function getDefaultRouteForRole(role: UserRole): string {
  switch (role) {
    case "BORROWER":
      return ROUTES.BORROWER_HOME;
    case "ADMIN":
    case "SALES":
    case "SANCTION":
    case "DISBURSEMENT":
    case "COLLECTION":
      return ROUTES.DASHBOARD_HOME;
    default:
      return ROUTES.UNAUTHORIZED;
  }
}
