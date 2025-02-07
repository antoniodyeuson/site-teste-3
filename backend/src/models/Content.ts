import mongoose, { Schema } from 'mongoose';
import { Content } from '../types';

const contentSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['image', 'video', 'audio', 'text']
  },
  url: {
    type: String,
    required: true
  },
  preview: {
    type: String
  },
  isPreview: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    min: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

export default mongoose.model<Content>('Content', contentSchema); 