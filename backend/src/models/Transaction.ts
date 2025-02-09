import mongoose from 'mongoose';

interface Transaction {
  creatorId: string;
  userId: string;
  type: 'subscription' | 'content' | 'tip';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  stripePaymentId?: string;
  createdAt: Date;
}

const transactionSchema = new mongoose.Schema<Transaction>({
  creatorId: {
    type: String,
    required: true,
    ref: 'Creator'
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  type: {
    type: String,
    required: true,
    enum: ['subscription', 'content', 'tip']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  stripePaymentId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<Transaction>('Transaction', transactionSchema); 