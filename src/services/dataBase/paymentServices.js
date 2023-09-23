import Stripe from 'stripe';
import config from '../../config/config.js';

const stripe = new Stripe(config.stripe.sk);

// Intento de pago 
const createPaymentIntent = async (data) => await stripe.paymentIntents.create(data)


export {
    createPaymentIntent,
}