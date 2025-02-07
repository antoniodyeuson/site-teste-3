import mongoose from 'mongoose';

interface Settings {
  platformFee: number;
  minWithdrawalAmount: number;
  maxFileSize: number;
  allowedFileTypes: string[];
  maintenanceMode: boolean;
  supportEmail: string;
  termsUrl: string;
  privacyUrl: string;
  updatedAt: Date;
}

const settingsSchema = new mongoose.Schema<Settings>({
  platformFee: {
    type: Number,
    required: true,
    default: 15 // 15%
  },
  minWithdrawalAmount: {
    type: Number,
    required: true,
    default: 50 // $50
  },
  maxFileSize: {
    type: Number,
    required: true,
    default: 104857600 // 100MB
  },
  allowedFileTypes: {
    type: [String],
    default: ['image/jpeg', 'image/png', 'video/mp4', 'audio/mpeg']
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  supportEmail: {
    type: String,
    required: true,
    default: 'support@example.com'
  },
  termsUrl: String,
  privacyUrl: String,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<Settings>('Settings', settingsSchema); 