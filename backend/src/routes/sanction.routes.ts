import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/rbac.middleware';
import { USER_ROLES } from '../constants/roles';
import {
  getAppliedLoansHandler,
  getAppliedLoanByIdHandler,
  approveLoanHandler,
  rejectLoanHandler,
} from '../controllers/sanction.controller';

const router = Router();

router.get(
  '/loans',
  authenticate,
  requireRoles(USER_ROLES.ADMIN, USER_ROLES.SANCTION),
  getAppliedLoansHandler,
);

router.get(
  '/loans/:loanId',
  authenticate,
  requireRoles(USER_ROLES.ADMIN, USER_ROLES.SANCTION),
  getAppliedLoanByIdHandler,
);

router.patch(
  '/loans/:loanId/approve',
  authenticate,
  requireRoles(USER_ROLES.ADMIN, USER_ROLES.SANCTION),
  approveLoanHandler,
);

router.patch(
  '/loans/:loanId/reject',
  authenticate,
  requireRoles(USER_ROLES.ADMIN, USER_ROLES.SANCTION),
  rejectLoanHandler,
);

export default router;
