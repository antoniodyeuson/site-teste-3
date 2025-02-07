import mongoose from 'mongoose';
import { Content } from '../types';

const contentSchema = new mongoose.Schema<Content>({
  creatorId: { 
    type: String, 
    required: true,
    ref: 'Creator'
  },
  title: { 
    type: String, 
    required: true 
  },
  description: String,
  type: { 
    type: String, 
    enum: ['image', 'video', 'audio', 'live'],
    required: true 
  },
  url: { 
    type: String, 
    required: true 
  },
  thumbnailUrl: String,
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