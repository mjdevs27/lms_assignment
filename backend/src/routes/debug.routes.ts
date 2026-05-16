import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRoles, requireBorrower, requireDashboardAccess } from '../middleware/rbac.middleware';
import { USER_ROLES } from '../constants/roles';

const router = Router();

/**
 * Development-only debug routes for testing middleware behavior.
 * These routes must NOT be registered in production.
 */

// Test: authenticated user (any role)
router.get('/authenticated', authenticate, (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Authenticated access granted',
    data: { user: _req.user?.toJSON() },
  });
});

// Test: borrower-only access
router.get('/borrower-only', authenticate, requireBorrower, (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Borrower access granted',
    data: { user: _req.user?.toJSON() },
  });
});

// Test: admin-only access
router.get('/admin-only', authenticate, requireRoles(USER_ROLES.ADMIN), (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Admin access granted',
    data: { user: _req.user?.toJSON() },
  });
});

// Test: dashboard access (all internal roles)
router.get('/dashboard-only', authenticate, requireDashboardAccess, (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Dashboard access granted',
    data: { user: _req.user?.toJSON() },
  });
});

export default router;
