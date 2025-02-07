import express from 'express';
import { auth, checkRole } from '../middleware/auth';
import User from '../models/User';
import Content from '../models/Content';
import { AuthRequest } from '../types/express';

const router = express.Router();

// Get all users
router.get('/users', auth, checkRole(['admin']), async (req: AuthRequest, res) => {
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
});

// Update user
router.patch('/users/:id', auth, checkRole(['admin']), async (req: AuthRequest, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'role', 'status'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    updates.forEach(update => user[update] = req.body[update]);
    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
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
router.get('/dashboard', auth, checkRole(['admin']), async (req: AuthRequest, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),
      totalContent: await Content.countDocuments(),
      recentUsers: await User.find()
        .select('-password')
        .sort('-createdAt')
        .limit(5)
        .lean(),
      recentContent: await Content.find()
        .populate('creatorId', 'name')
        .sort('-createdAt')
        .limit(5)
        .lean()
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 