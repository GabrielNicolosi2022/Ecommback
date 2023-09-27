import Stripe from 'stripe';
import config from '../../config/config.js';

const stripe = new Stripe(config.stripe.sk);

// Intento de pago
const createPaymentIntent = async (paymentInfo) =>
  await stripe.paymentIntents.create(paymentInfo);

export { createPaymentIntent };
