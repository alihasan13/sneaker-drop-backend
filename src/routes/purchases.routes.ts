import { Router } from 'express';
import { purchasesController } from '../controllers/purchases.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { confirmPurchaseSchema } from '../validators/reservations.validator';

const router = Router();

router.use(authMiddleware);

router.post('/', validate(confirmPurchaseSchema), purchasesController.confirmPurchase);
router.get('/me', purchasesController.getMyPurchases);

export default router;
