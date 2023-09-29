import { Router } from 'express';
import { createSession } from '../services/dataBase/paymentServices.js';

const paymentRouter = Router();

paymentRouter.get('/success', (req, res) => {
  res.send('success');
});
paymentRouter.get('/cancel', (req, res) => {
  res.send('cancel');
});

export default paymentRouter;
