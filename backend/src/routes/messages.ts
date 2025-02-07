import express from 'express';
import { auth } from '../middleware/auth';
import Message from '../models/Message';

const router = express.Router();

// Get chat history with a user
router.get('/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user._id }
      ]
    })
    .sort({ createdAt: 1 })
    .limit(50);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    const message = new Message({
      senderId: req.user._id,
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
router.patch('/read/:senderId', auth, async (req, res) => {
  try {
    await Message.updateMany(
      {
        senderId: req.params.senderId,
        receiverId: req.user._id,
        read: false
      },
      { read: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 