import mongoose, { Schema } from 'mongoose';
import { Purchase } from '../types';

const purchaseSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contentId: {
    type: Schema.Types.ObjectId,
    ref: 'Content',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<Purchase>('Purchase', purchaseSchema); 