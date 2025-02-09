import mongoose, { Document } from 'mongoose';
import { UserDocument } from './User';

export interface CreatorDocument extends Document {
  user: UserDocument['_id'];
  coverImage?: string;
  price: number;
  description?: string;
  categories: string[];
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  stripeAccountId?: string;
  stripePriceId?: string;
  allowTips?: boolean;
  minimumTipAmount?: number;
  bankInfo?: {
    bankName: string;
    accountType: 'corrente' | 'poupanca';
    agency: string;
    accountNumber: string;
    pixKey: string;
    verified: boolean;
  };
  verificationStatus?: {
    cpfVerified: boolean;
    bankVerified: boolean;
    emailVerified: boolean;
  };
  notifications?: {
    newSubscriber: boolean;
    newMessage: boolean;
    newPurchase: boolean;
    newTip: boolean;
  };
  cpf?: string;
  birthDate?: Date;
  phone?: string;
}

const creatorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverImage: {
    type: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String
  },
  categories: [{
    type: String
  }],
  socialLinks: {
    instagram: String,
    twitter: String,
    youtube: String
  },
  stripeAccountId: String,
  stripePriceId: String,
  allowTips: {
    type: Boolean,
    default: true
  },
  minimumTipAmount: {
    type: Number,
    default: 5
  },
  bankInfo: {
    bankName: String,
    accountType: {
      type: String,
      enum: ['corrente', 'poupanca']
    },
    agency: String,
    accountNumber: String,
    pixKey: String,
    verified: {
      type: Boolean,
      default: false
    }
  },
  verificationStatus: {
    cpfVerified: {
      type: Boolean,
      default: false
    },
    bankVerified: {
      type: Boolean,
      default: false
    },
    emailVerified: {
      type: Boolean,
      default: false
    }
  },
  notifications: {
    newSubscriber: {
      type: Boolean,
      default: true
    },
    newMessage: {
      type: Boolean,
      default: true
    },
    newPurchase: {
      type: Boolean,
      default: true
    },
    newTip: {
      type: Boolean,
      default: true
    }
  },
  cpf: {
    type: String,
    sparse: true
  },
  birthDate: Date,
  phone: String
}, {
  timestamps: true
});

const Creator = mongoose.model<CreatorDocument>('Creator', creatorSchema);

export default Creator; 