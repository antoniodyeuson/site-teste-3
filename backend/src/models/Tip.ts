import mongoose from 'mongoose';

interface Tip {
  senderId: string;
  receiverId: string;
  amount: number;
  message?: string;
  createdAt: Date;
}

const tipSchema = new mongoose.Schema<Tip>({
  senderId: {
    type: String,
    required: true,
    ref: 'User'
  },
  receiverId: {
    type: String,
    required: true,
    ref: 'Creator'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<Tip>('Tip', tipSchema); 