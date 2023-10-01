import { Router } from 'express';
import {
  paymentCancel,
  paymentSuccess,
} from '../controllers/payment.controller.js';
import { checkRole } from '../middlewares/auth.js';

const paymentRouter = Router();

paymentRouter.get(
  '/success/:cid',
  checkRole('user', 'premium'),
  paymentSuccess
);
paymentRouter.get('/cancel/:cid', checkRole('user', 'premium'), paymentCancel);

export default paymentRouter;
