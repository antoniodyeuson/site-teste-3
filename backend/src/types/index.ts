import { Document } from 'mongoose';

export interface User extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'creator' | 'subscriber';
  profileImage?: string;
  coverImage?: string;
  stripeCustomerId?: string;
  price?: number;
  stripeAccountId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Creator extends User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'creator';
  profileImage?: string;
  bio?: string;
  cpf?: string;
  birthDate?: Date;
  phone?: string;
  subscriptionPrice: number;
  commissionRate: number;
  totalEarnings: number;
  subscriberCount: number;
  contentCount: number;
  stripeAccountId?: string;
  bankInfo?: {
    bankName: string;
    accountType: 'corrente' | 'poupanca';
    agency: string;
    accountNumber: string;
    pixKey?: string;
    verified: boolean;
  };
  notifications: {
    newSubscriber: boolean;
    newMessage: boolean;
    newPurchase: boolean;
    newTip: boolean;
  };
  verificationStatus: {
    cpfVerified: boolean;
    bankVerified: boolean;
    emailVerified: boolean;
  };
  allowTips: boolean;
  minimumTipAmount: number;
  allowMessages: boolean;
  allowComments: boolean;
  notifyNewSubscribers: boolean;
  payoutMethod: 'stripe' | 'bank';
  createdAt: Date;
  updatedAt: Date;
}

export interface Content extends Document {
  _id: string;
  title: string;
  description?: string;
  type: 'image' | 'video' | 'audio' | 'text';
  url: string;
  preview?: string;
  isPreview: boolean;
  price?: number;
  likes: number;
  creatorId: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Purchase extends Document {
  userId: User;
  contentId: Content;
  price: number;
  createdAt: Date;
}

export interface Withdrawal {
  creatorId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod: 'pix' | 'bank_transfer';
  transactionId?: string;
  failureReason?: string;
  createdAt: Date;
  completedAt?: Date;
} 