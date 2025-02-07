export interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: 'creator' | 'subscriber' | 'admin';
  profileImage?: string;
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
}

export interface Content {
  _id: string;
  creatorId: string;
  title: string;
  description?: string;
  type: 'image' | 'video' | 'audio' | 'live';
  url: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
} 