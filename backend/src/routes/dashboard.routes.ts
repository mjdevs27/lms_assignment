import { Router } from 'express';
import salesRoutes from './sales.routes';
import sanctionRoutes from './sanction.routes';
import disbursementRoutes from './disbursement.routes';
import collectionRoutes from './collection.routes';

const router = Router();

router.use('/sales', salesRoutes);
router.use('/sanction', sanctionRoutes);
router.use('/disbursement', disbursementRoutes);
router.use('/collection', collectionRoutes);

export default router;
