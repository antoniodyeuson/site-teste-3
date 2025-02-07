import express from 'express';
import { auth, checkRole } from '../middleware/auth';
import Subscription from '../models/Subscription';
import Content from '../models/Content';
import Creator from '../models/Creator';
import SavedContent from '../models/SavedContent';
import { isAuthenticated } from '../middlewares/auth';
import { isSubscriber } from '../middlewares/roles';

const router = express.Router();

// Get subscriber's subscriptions
router.get('/subscriptions/my', auth, checkRole(['subscriber']), async (req, res) => {
  try {
    const subscriptions = await Subscription.find({
      subscriberId: req.user.id,
      status: 'active'
    }).populate('creatorId', 'name profileImage coverImage price');

    const creators = subscriptions.map(sub => ({
      id: sub.creatorId._id,
      name: sub.creatorId.name,
      profileImage: sub.creatorId.profileImage,
      coverImage: sub.creatorId.coverImage,
      price: sub.creatorId.price,
      isSubscribed: true
    }));

    res.json(creators);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recommended creators
router.get('/creators/recommended', auth, async (req, res) => {
  try {
    const creators = await Creator.find()
      .select('name profileImage coverImage price')
      .limit(8)
      .lean();

    const userSubs = await Subscription.find({
      subscriberId: req.user.id,
      status: 'active'
    }).select('creatorId');

    const subscribedCreatorIds = userSubs.map(sub => sub.creatorId.toString());

    const recommendedCreators = creators.map(creator => ({
      ...creator,
      id: creator._id,
      isSubscribed: subscribedCreatorIds.includes(creator._id.toString())
    }));

    res.json(recommendedCreators);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trending content
router.get('/content/trending', auth, async (req, res) => {
  try {
    const trendingContent = await Content.find({ status: 'active' })
      .sort({ likes: -1, createdAt: -1 })
      .limit(6)
      .populate('creatorId', 'name profileImage')
      .lean();

    const userPurchases = await Purchase.find({
      userId: req.user.id,
      status: 'completed'
    }).select('contentId');

    const purchasedContentIds = userPurchases.map(purchase => 
      purchase.contentId.toString()
    );

    const formattedContent = trendingContent.map(content => ({
      id: content._id,
      title: content.title,
      preview: content.preview,
      type: content.type,
      price: content.price,
      likes: content.likes,
      creator: {
        id: content.creatorId._id,
        name: content.creatorId.name,
        profileImage: content.creatorId.profileImage
      },
      isPurchased: purchasedContentIds.includes(content._id.toString())
    }));

    res.json(formattedContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Rota para buscar dados do dashboard do assinante
router.get('/dashboard', isAuthenticated, isSubscriber, async (req, res) => {
  try {
    const data = {
      stats: {
        totalSubscriptions: 5,
        savedContent: 15,
        watchedContent: 30,
        totalInteractions: 45
      },
      subscriptions: [],
      recentContent: [],
      savedContent: []
    };

    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do dashboard' });
  }
});

// Salvar conteúdo
router.post('/content/save/:contentId', auth, checkRole(['subscriber']), async (req, res) => {
  try {
    const { contentId } = req.params;
    const subscriberId = req.user.id;

    // Verifica se o conteúdo existe
    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ message: 'Conteúdo não encontrado' });
    }

    // Verifica se o usuário tem acesso ao conteúdo
    const hasAccess = await Subscription.findOne({
      subscriberId,
      creatorId: content.creatorId,
      status: 'active'
    });

    if (!content.isPreview && !hasAccess) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    // Salva o conteúdo
    const savedContent = new SavedContent({
      subscriberId,
      contentId
    });

    await savedContent.save();
    res.status(201).json({ message: 'Conteúdo salvo com sucesso' });
  } catch (error) {
    if (error.code === 11000) { // Erro de duplicata
      return res.status(400).json({ message: 'Conteúdo já está salvo' });
    }
    res.status(500).json({ message: 'Erro ao salvar conteúdo' });
  }
});

// Remover conteúdo salvo
router.delete('/content/save/:contentId', auth, checkRole(['subscriber']), async (req, res) => {
  try {
    const { contentId } = req.params;
    const subscriberId = req.user.id;

    const result = await SavedContent.findOneAndDelete({
      subscriberId,
      contentId
    });

    if (!result) {
      return res.status(404).json({ message: 'Conteúdo não encontrado nos salvos' });
    }

    res.json({ message: 'Conteúdo removido dos salvos' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover conteúdo dos salvos' });
  }
});

// Listar conteúdos salvos
router.get('/content/saved', auth, checkRole(['subscriber']), async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const savedContent = await SavedContent.find({
      subscriberId: req.user.id
    })
    .populate({
      path: 'contentId',
      populate: {
        path: 'creatorId',
        select: 'name profileImage'
      }
    })
    .sort('-savedAt')
    .skip(skip)
    .limit(limit);

    const total = await SavedContent.countDocuments({ subscriberId: req.user.id });

    res.json({
      items: savedContent.map(saved => ({
        id: saved.contentId._id,
        title: saved.contentId.title,
        preview: saved.contentId.preview,
        type: saved.contentId.type,
        savedAt: saved.savedAt,
        creator: {
          id: saved.contentId.creatorId._id,
          name: saved.contentId.creatorId.name,
          profileImage: saved.contentId.creatorId.profileImage
        }
      })),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar conteúdos salvos' });
  }
});

router.get('/stats', isAuthenticated, isSubscriber, async (req, res) => {
  try {
    const stats = {
      totalSubscriptions: 0, // Implementar lógica real
      savedContent: 0,
      watchedContent: 0,
      totalInteractions: 0
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

export default router; 