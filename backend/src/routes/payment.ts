import express from 'express';
import { auth, checkRole } from '../middleware/auth';
import { 
  createStripeAccount, 
  createSubscription, 
  createPaymentIntent 
} from '../services/stripe';
import Creator from '../models/Creator';
import Subscription from '../models/Subscription';
import { AuthRequest } from '../types/express';
import { Creator as CreatorType } from '../types';

const router = express.Router();

interface CreatorWithStripe extends CreatorType {
  stripePriceId?: string;
  stripeAccountId?: string;
}

// Connect Stripe account
router.post('/connect-stripe', auth, checkRole(['creator']), async (req, res) => {
  try {
    const creator = await Creator.findById(req.user._id);
    if (!creator) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    const stripeAccount = await createStripeAccount(creator.email);
    creator.stripeAccountId = stripeAccount.id;
    await creator.save();

    res.json({ accountLink: stripeAccount.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create subscription
router.post('/subscribe/:creatorId', auth, async (req: AuthRequest, res) => {
  try {
    const creator = await Creator.findById(req.params.creatorId) as CreatorWithStripe;
    if (!creator) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    if (!creator.stripePriceId || !creator.stripeAccountId) {
      return res.status(400).json({ message: 'Creator stripe account not configured' });
    }

    if (!req.user?.stripeCustomerId) {
      return res.status(400).json({ message: 'User stripe account not configured' });
    }

    const subscription = await createSubscription(
      req.user.stripeCustomerId,
      creator.stripePriceId,
      creator.stripeAccountId
    );

    const newSubscription = new Subscription({
      subscriberId: req.user.id,
      creatorId: creator._id,
      price: creator.subscriptionPrice,
      stripeSubscriptionId: subscription.id,
      endDate: new Date(subscription.current_period_end * 1000)
    });

    await newSubscription.save();
    res.json(newSubscription);
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel subscription
router.post('/cancel-subscription/:subscriptionId', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.subscriptionId,
      subscriberId: req.user._id
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    subscription.status = 'cancelled';
    await subscription.save();

    res.json({ message: 'Subscription cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 