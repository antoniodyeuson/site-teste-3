import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

interface Admin {
  email: string;
  password: string;
  name: string;
  role: 'admin';
  lastLogin?: Date;
}

const adminSchema = new mongoose.Schema<Admin>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'admin',
    immutable: true
  },
  lastLogin: Date
});

// Criar admin padrão se não existir
adminSchema.statics.createDefaultAdmin = async function() {
  try {
    const adminExists = await this.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await this.create({
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'admin'
      });
      console.log('Default admin account created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

export default mongoose.model<Admin>('Admin', adminSchema); 