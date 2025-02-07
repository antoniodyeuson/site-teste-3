import express from 'express';
import { auth, checkRole } from '../middleware/auth';
import { 
  createStripeAccount, 
  createSubscription, 
  createPaymentIntent 
} from '../services/stripe';
import Creator from '../models/Creator';
import Subscription from '../models/Subscription';

const router = express.Router();

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
router.post('/subscribe/:creatorId', auth, async (req, res) => {
  try {
    const creator = await Creator.findById(req.params.creatorId);
    if (!creator) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    const subscription = await createSubscription(
      req.user.stripeCustomerId,
      creator.stripePriceId,
      creator.stripeAccountId
    );

    const newSubscription = new Subscription({
      subscriberId: req.user._id,
      creatorId: creator._id,
      price: creator.subscriptionPrice,
      stripeSubscriptionId: subscription.id,
      endDate: new Date(subscription.current_period_end * 1000)
    });

    await newSubscription.save();
    res.json(newSubscription);
  } catch (error) {
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