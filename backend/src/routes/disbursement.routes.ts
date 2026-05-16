import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/rbac.middleware';
import { USER_ROLES } from '../constants/roles';
import {
  getSanctionedLoansHandler,
  getSanctionedLoanByIdHandler,
  disburseLoanHandler,
} from '../controllers/disbursement.controller';

const router = Router();

router.get(
  '/loans',
  authenticate,
  requireRoles(USER_ROLES.ADMIN, USER_ROLES.DISBURSEMENT),
  getSanctionedLoansHandler,
);

router.get(
  '/loans/:loanId',
  authenticate,
  requireRoles(USER_ROLES.ADMIN, USER_ROLES.DISBURSEMENT),
  getSanctionedLoanByIdHandler,
);

router.patch(
  '/loans/:loanId/disburse',
  authenticate,
  requireRoles(USER_ROLES.ADMIN, USER_ROLES.DISBURSEMENT),
  disburseLoanHandler,
);

export default router;
