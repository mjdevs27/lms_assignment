import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/rbac.middleware';
import { USER_ROLES } from '../constants/roles';
import { listSalesLeads, getSalesLeadDetail } from '../controllers/sales.controller';

const router = Router();

router.get(
  '/leads',
  authenticate,
  requireRoles(USER_ROLES.ADMIN, USER_ROLES.SALES),
  listSalesLeads,
);

router.get(
  '/leads/:borrowerId',
  authenticate,
  requireRoles(USER_ROLES.ADMIN, USER_ROLES.SALES),
  getSalesLeadDetail,
);

export default router;
