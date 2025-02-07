import mongoose, { Schema, Document } from 'mongoose';

export interface ISavedContent extends Document {
  subscriberId: mongoose.Types.ObjectId;
  contentId: mongoose.Types.ObjectId;
  savedAt: Date;
}

const SavedContentSchema: Schema = new Schema({
  subscriberId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contentId: {
    type: Schema.Types.ObjectId,
    ref: 'Content',
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índice composto para evitar duplicatas
SavedContentSchema.index({ subscriberId: 1, contentId: 1 }, { unique: true });

export default mongoose.model<ISavedContent>('SavedContent', SavedContentSchema); 