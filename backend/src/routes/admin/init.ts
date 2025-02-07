import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../../models/User';

const router = express.Router();

router.post('/init', async (req, res) => {
  try {
    // Verifica se já existe um admin
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Cria o admin com credenciais padrão
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Administrator',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();

    res.status(201).json({ message: 'Admin account created successfully' });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rota para atualizar credenciais do admin
router.patch('/credentials', async (req, res) => {
  try {
    const { currentPassword, newEmail, newPassword } = req.body;

    // Encontra o admin
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Verifica a senha atual
    const isValidPassword = await bcrypt.compare(currentPassword, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Atualiza o email se fornecido
    if (newEmail) {
      admin.email = newEmail;
    }

    // Atualiza a senha se fornecida
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedPassword;
    }

    await admin.save();

    res.json({ message: 'Admin credentials updated successfully' });
  } catch (error) {
    console.error('Error updating admin credentials:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 