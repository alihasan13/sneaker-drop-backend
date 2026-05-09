import { Router } from 'express';
import { reservationsController } from '../controllers/reservations.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createReservationSchema,
  reservationIdParamSchema,
} from '../validators/reservations.validator';

const router = Router();

// All reservation routes require auth
router.use(authMiddleware);

router.get('/me', reservationsController.getMyReservations);
router.get('/me/:dropId', reservationsController.getActiveReservationForDrop);
router.post('/', validate(createReservationSchema), reservationsController.createReservation);
router.delete(
  '/:id',
  validate(reservationIdParamSchema, 'params'),
  reservationsController.cancelReservation
);

export default router;
