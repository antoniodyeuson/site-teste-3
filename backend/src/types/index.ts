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
  bio?: string;
  subscriptionPrice: number;
  commissionRate: number;
  totalEarnings: number;
  subscriberCount: number;
  contentCount: number;
  stripeAccountId?: string;
  stripePriceId?: string;
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