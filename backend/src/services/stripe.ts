import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY must be defined in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

export default stripe;

export const createStripeAccount = async (email: string) => {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true }
      }
    });
    return account;
  } catch (error) {
    throw error;
  }
};

export const createSubscription = async (
  customerId: string,
  priceId: string,
  creatorStripeAccountId: string
) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      application_fee_percent: 15,
      transfer_data: {
        destination: creatorStripeAccountId
      }
    });
    return subscription;
  } catch (error) {
    throw error;
  }
};

export const createPaymentIntent = async (
  amount: number,
  currency: string,
  creatorStripeAccountId: string
) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      application_fee_amount: Math.round(amount * 0.15),
      transfer_data: {
        destination: creatorStripeAccountId
      }
    });
    return paymentIntent;
  } catch (error) {
    throw error;
  }
}; 