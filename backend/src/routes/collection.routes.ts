import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/rbac.middleware';
import { USER_ROLES } from '../constants/roles';
import {
  getDisbursedLoansHandler,
  getDisbursedLoanByIdHandler,
  recordPaymentHandler,
  getLoanPaymentsHandler,
} from '../controllers/collection.controller';

const router = Router();

router.get(
  '/loans',
  authenticate,
  requireRoles(USER_ROLES.ADMIN, USER_ROLES.COLLECTION),
  getDisbursedLoansHandler,
);

router.get(
  '/loans/:loanId',
  authenticate,
  requireRoles(USER_ROLES.ADMIN, USER_ROLES.COLLECTION),
  getDisbursedLoanByIdHandler,
);

router.post(
  '/loans/:loanId/payments',
  authenticate,
  requireRoles(USER_ROLES.ADMIN, USER_ROLES.COLLECTION),
  recordPaymentHandler,
);

router.get(
  '/loans/:loanId/payments',
  authenticate,
  requireRoles(USER_ROLES.ADMIN, USER_ROLES.COLLECTION),
  getLoanPaymentsHandler,
);

export default router;
