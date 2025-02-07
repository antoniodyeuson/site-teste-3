import mongoose from 'mongoose';

interface Subscription {
  subscriberId: string;
  creatorId: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  price: number;
  stripeSubscriptionId?: string;
}

const subscriptionSchema = new mongoose.Schema<Subscription>({
  subscriberId: {
    type: String,
    required: true,
    ref: 'User'
  },
  creatorId: {
    type: String,
    required: true,
    ref: 'Creator'
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stripeSubscriptionId: String
});

export default mongoose.model<Subscription>('Subscription', subscriptionSchema); 