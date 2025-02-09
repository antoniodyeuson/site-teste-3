import express, { Router, Response } from 'express';
import { auth } from '../middleware/auth';
import Message from '../models/Message';
import { AuthRequest, AuthRequestHandler } from '../types/express';

const router = Router();

// Get chat history with a user
const getChatHistory: AuthRequestHandler = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user!.id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user!.id }
      ]
    })
    .sort({ createdAt: 1 })
    .limit(50);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

router.get('/:userId', auth, getChatHistory);

// Send a message
router.post('/', auth, async (req: AuthRequest, res) => {
  try {
    const { receiverId, content } = req.body;

    const message = new Message({
      senderId: req.user!.id,
      receiverId,
      content
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark messages as read
router.patch('/read/:senderId', auth, async (req: AuthRequest, res) => {
  try {
    await Message.updateMany(
      {
        senderId: req.params.senderId,
        receiverId: req.user!.id,
        read: false
      },
      { read: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/conversations', auth, (async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  // ... resto do código
}) as AuthRequestHandler);

export default router; 