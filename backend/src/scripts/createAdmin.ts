import mongoose from 'mongoose';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = new User({
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('Admin criado com sucesso');
  } catch (error) {
    console.error('Erro ao criar admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin(); 