import { Router } from 'express';
import { dropsController } from '../controllers/drops.controller';
import { validate } from '../middleware/validate.middleware';
import { createDropSchema, dropIdParamSchema } from '../validators/drops.validator';

const router = Router();

// Public
router.get('/', dropsController.getActiveDrops);
router.get('/admin', dropsController.getAllDropsAdmin);
router.get('/:id', validate(dropIdParamSchema, 'params'), dropsController.getDropById);

// Admin (no auth guard for demo simplicity)
router.post('/', validate(createDropSchema), dropsController.createDrop);
router.patch('/:id/activate', validate(dropIdParamSchema, 'params'), dropsController.activateDrop);

export default router;
