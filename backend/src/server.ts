import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import contentRoutes from './routes/content';
import creatorRoutes from './routes/creator';
import paymentRoutes from './routes/payment';
import subscriberRoutes from './routes/subscriber';
import adminInitRoutes from './routes/admin/init';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/creator', creatorRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/subscriber', subscriberRoutes);
app.use('/api/admin', adminInitRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 