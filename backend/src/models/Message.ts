import mongoose from 'mongoose';

interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

const messageSchema = new mongoose.Schema<Message>({
  senderId: {
    type: String,
    required: true,
    ref: 'User'
  },
  receiverId: {
    type: String,
    required: true,
    ref: 'User'
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<Message>('Message', messageSchema); 