import express from 'express';
import { auth, checkRole } from '../middleware/auth';
import { upload } from '../middleware/upload';
import Content from '../models/Content';

const router = express.Router();

// Get all content (with pagination)
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const content = await Content.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Content.countDocuments();

    res.json({
      content,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new content
router.post('/', auth, checkRole(['creator']), upload.single('file'), async (req, res) => {
  try {
    const { title, description, type } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const content = new Content({
      creatorId: req.user._id,
      title,
      description,
      type,
      url: file.path,
      thumbnailUrl: type === 'video' ? '' : file.path // TODO: Generate video thumbnail
    });

    await content.save();
    res.status(201).json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get content by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update content
router.patch('/:id', auth, checkRole(['creator']), async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    const content = await Content.findOne({ 
      _id: req.params.id,
      creatorId: req.user._id 
    });

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    updates.forEach(update => content[update] = req.body[update]);
    await content.save();

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete content
router.delete('/:id', auth, checkRole(['creator']), async (req, res) => {
  try {
    const content = await Content.findOneAndDelete({
      _id: req.params.id,
      creatorId: req.user._id
    });

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ message: 'Content deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 