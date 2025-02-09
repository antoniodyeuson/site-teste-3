import express, { Router, Response } from 'express';
import stripe from '../services/stripe';
import Transaction from '../models/Transaction';
import Stripe from 'stripe';
import { AuthRequest, AuthRequestHandler } from '../types/express';

const router = Router();

router.post('/webhook', express.raw({type: 'application/json'}), async (req: AuthRequest, res: Response) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await Transaction.findOneAndUpdate(
          { stripePaymentId: paymentIntent.id },
          { status: 'completed' }
        );
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await Transaction.findOneAndUpdate(
          { stripePaymentId: failedPayment.id },
          { status: 'failed' }
        );
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
}) as AuthRequestHandler;

router.post('/stripe', (async (req: AuthRequest, res) => {
  try {
    // ... código existente
  } catch (error) {
    res.status(500).json({ message: 'Webhook error' });
  }
}) as AuthRequestHandler);

export default router; 