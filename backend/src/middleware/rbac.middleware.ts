import { Request, Response, NextFunction } from 'express';
import { UserRole, USER_ROLES, DASHBOARD_ROLES } from '../constants/roles';

/**
 * Role-based access control middleware factory.
 * Allows only the listed roles to proceed. Returns 403 otherwise.
 *
 * Usage:
 *   router.get('/admin', authenticate, requireRoles(USER_ROLES.ADMIN), handler);
 *   router.get('/sanction', authenticate, requireRoles(USER_ROLES.ADMIN, USER_ROLES.SANCTION), handler);
 */
export const requireRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource',
      });
      return;
    }

    next();
  };
};

/**
 * Allow only BORROWER role.
 */
export const requireBorrower = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  if (req.user.role !== USER_ROLES.BORROWER) {
    res.status(403).json({
      success: false,
      message: 'Only borrowers can access this resource',
    });
    return;
  }

  next();
};

/**
 * Allow dashboard-eligible roles only (ADMIN, SALES, SANCTION, DISBURSEMENT, COLLECTION).
 * Borrowers are explicitly blocked.
 */
export const requireDashboardAccess = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  if (!DASHBOARD_ROLES.includes(req.user.role)) {
    res.status(403).json({
      success: false,
      message: 'Borrowers cannot access dashboard resources',
    });
    return;
  }

  next();
};
