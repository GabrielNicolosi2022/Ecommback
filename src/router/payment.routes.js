import { Router } from 'express';
import {
  paymentCancel,
  paymentSuccess,
} from '../controllers/payment.controller.js';

const paymentRouter = Router();

paymentRouter.get('/success/:cid', paymentSuccess);
paymentRouter.get('/cancel/:cid', paymentCancel);

export default paymentRouter;
