import mongoose from 'mongoose';

interface Report {
  contentId: string;
  reporterId: string;
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
}

const reportSchema = new mongoose.Schema<Report>({
  contentId: {
    type: String,
    required: true,
    ref: 'Content'
  },
  reporterId: {
    type: String,
    required: true,
    ref: 'User'
  },
  reason: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'resolved', 'dismissed'],
    default: 'pending'
  },
  resolvedAt: Date,
  resolvedBy: {
    type: String,
    ref: 'Admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<Report>('Report', reportSchema); 