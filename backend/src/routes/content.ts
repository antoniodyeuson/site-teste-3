import express from 'express';
import { auth, checkRole } from '../middleware/auth';
import { upload } from '../middleware/upload';
import Content from '../models/Content';
import { AuthRequest } from '../types/express';

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

// Get creator's content
router.get('/creator', auth, checkRole(['creator']), async (req: AuthRequest, res) => {
  try {
    const contents = await Content.find({ 
      creatorId: req.user!.id 
    })
    .sort('-createdAt')
    .populate('creatorId', 'name profileImage');

    res.json(contents);
  } catch (error) {
    console.error('Erro ao buscar conteúdos:', error);
    res.status(500).json({ message: 'Erro ao buscar conteúdos' });
  }
});

// Create content
router.post('/', auth, checkRole(['creator']), upload.single('file'), async (req: AuthRequest, res) => {
  try {
    const { title, description, type, isPreview, price } = req.body;
    
    if (!req.file && type !== 'text') {
      return res.status(400).json({ message: 'Arquivo não fornecido' });
    }

    const content = new Content({
      title,
      description,
      type,
      url: req.file?.path || '',
      preview: req.file?.path, // Implementar geração de preview
      isPreview: Boolean(isPreview),
      price: Number(price) || 0,
      creatorId: req.user!.id
    });

    await content.save();
    res.status(201).json(content);
  } catch (error) {
    console.error('Erro ao criar conteúdo:', error);
    res.status(500).json({ message: 'Erro ao criar conteúdo' });
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
router.patch('/:id', auth, checkRole(['creator']), async (req: AuthRequest, res) => {
  try {
    const content = await Content.findOne({
      _id: req.params.id,
      creatorId: req.user!.id
    });

    if (!content) {
      return res.status(404).json({ message: 'Conteúdo não encontrado' });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'isPreview', 'price'];
    
    updates.forEach(update => {
      if (allowedUpdates.includes(update)) {
        content[update] = req.body[update];
      }
    });

    await content.save();
    res.json(content);
  } catch (error) {
    console.error('Erro ao atualizar conteúdo:', error);
    res.status(500).json({ message: 'Erro ao atualizar conteúdo' });
  }
});

// Delete content
router.delete('/:id', auth, checkRole(['creator']), async (req: AuthRequest, res) => {
  try {
    const content = await Content.findOneAndDelete({
      _id: req.params.id,
      creatorId: req.user!.id
    });

    if (!content) {
      return res.status(404).json({ message: 'Conteúdo não encontrado' });
    }

    // Implementar remoção do arquivo
    res.json({ message: 'Conteúdo removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover conteúdo:', error);
    res.status(500).json({ message: 'Erro ao remover conteúdo' });
  }
});

export default router; 