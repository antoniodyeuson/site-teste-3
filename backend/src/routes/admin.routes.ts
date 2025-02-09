import { Router, Response } from 'express';
import { auth, checkRole } from '../middleware/auth';
import User from '../models/User';
import Content from '../models/Content';
import { AuthRequest, AuthRequestHandler } from '../types/express';
import { UserRole, UserStatus } from '../models/User';

const router = Router();

// Get all users
router.get('/users', auth, checkRole(['admin']), (async (req: AuthRequest, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort('-createdAt')
      .lean();

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
}) as AuthRequestHandler);

// Update user
router.patch('/users/:id', auth, checkRole(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const { role, status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    // Validar role e status
    if (role && !['admin', 'creator', 'subscriber'].includes(role)) {
      res.status(400).json({ message: 'Role inválida' });
      return;
    }

    if (status && !['active', 'suspended', 'banned'].includes(status)) {
      res.status(400).json({ message: 'Status inválido' });
      return;
    }

    if (role) user.role = role as UserRole;
    if (status) user.status = status as UserStatus;
    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
});

// Delete user
router.delete('/users/:id', auth, checkRole(['admin']), async (req: AuthRequest, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all content
router.get('/content', auth, checkRole(['admin']), async (req: AuthRequest, res) => {
  try {
    const content = await Content.find()
      .populate('creatorId', 'name email')
      .sort('-createdAt')
      .lean();

    res.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete content
router.delete('/content/:id', auth, checkRole(['admin']), async (req: AuthRequest, res) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get admin dashboard stats
router.get('/dashboard-stats', auth, checkRole(['admin']), async (req: AuthRequest, res) => {
  try {
    const [
      totalUsers,
      totalCreators,
      totalContent,
      totalSubscribers,
      revenueResult
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'creator' }),
      Content.countDocuments(),
      User.countDocuments({ role: 'subscriber' }),
      Content.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: { $ifNull: ['$price', 0] } }
          }
        }
      ])
    ]);

    // Se não houver resultados da agregação, define totalRevenue como 0
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.json({
      totalUsers,
      totalCreators,
      totalSubscribers,
      totalContent,
      totalRevenue
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 