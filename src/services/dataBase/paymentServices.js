import Stripe from 'stripe';
import config from '../../config/config.js';

const stripe = new Stripe(config.stripe.sk);

// Intento de pago
const createPaymentIntent = async (paymentInfo) =>
  await stripe.paymentIntents.create(paymentInfo);

const createSession = async (paymentInfo) => {
  const session = await stripe.checkout.sessions.create(paymentInfo);
  return session;
};

export { createPaymentIntent, createSession };
