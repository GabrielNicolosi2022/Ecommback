import Stripe from 'stripe';
import config from '../../config/config.js';

const stripe = new Stripe(config.stripe.sk);

// Intento de pago 
const createPaymentIntent = async (data) => {
  const result = await stripe.paymentIntents.create(data);
  console.log(result.id);
  return result;
};


export {
    createPaymentIntent,
}