import mongoose from 'mongoose';
import { Content } from '../types';

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['image', 'video', 'audio', 'text'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  preview: String,
  isPreview: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Creator',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<Content>('Content', contentSchema); 