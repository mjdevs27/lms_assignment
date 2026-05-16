import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/rbac.middleware';
import { USER_ROLES } from '../constants/roles';
import { listAllUsers, createStaffUser, toggleUserActive } from '../controllers/admin.controller';

const router = Router();

router.get('/users', authenticate, requireRoles(USER_ROLES.ADMIN), listAllUsers);
router.post('/users', authenticate, requireRoles(USER_ROLES.ADMIN), createStaffUser);
router.patch('/users/:userId/toggle-active', authenticate, requireRoles(USER_ROLES.ADMIN), toggleUserActive);

export default router;
