import mongoose from 'mongoose';
import { Creator } from '../types';

const creatorSchema = new mongoose.Schema<Creator>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'creator' },
  profileImage: String,
  bio: String,
  subscriptionPrice: { type: Number, required: true, default: 0 },
  commissionRate: { type: Number, required: true, default: 15 },
  totalEarnings: { type: Number, default: 0 },
  subscriberCount: { type: Number, default: 0 },
  contentCount: { type: Number, default: 0 },
  stripeAccountId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<Creator>('Creator', creatorSchema); 