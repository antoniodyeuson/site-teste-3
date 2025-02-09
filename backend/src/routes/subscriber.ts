import express, { Request, Router, Response } from 'express';
import { auth, checkRole } from '../middleware/auth';
import Subscription from '../models/Subscription';
import Content from '../models/Content';
import Creator, { CreatorDocument } from '../models/Creator';
import SavedContent from '../models/SavedContent';
import User, { UserDocument } from '../models/User';
import Purchase from '../models/Purchase';
import { User as UserType, Content as ContentType, Purchase as PurchaseType } from '../types';
import { AuthRequest, AuthRequestHandler } from '../types/express';

interface PopulatedSubscription {
  creatorId: {
    _id: string;
    name: string;
    profileImage?: string;
    coverImage?: string;
    price?: number;
  };
}

interface PopulatedContent {
  _id: string;
  title: string;
  preview?: string;
  type: string;
  price?: number;
  likes?: number;
  creatorId: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  isPreview: boolean;
  createdAt: Date;
}

const router = Router();

// Get subscriber's subscriptions
router.get('/subscriptions/my', auth, checkRole(['subscriber']), (async (req: AuthRequest, res) => {
  try {
    const subscriptions = await Subscription.find({
      subscriberId: req.user!.id,
      status: 'active'
    }).populate<{ creatorId: PopulatedSubscription['creatorId'] }>('creatorId', 'name profileImage coverImage price');

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
    res.status(500).json({ message: 'Erro ao buscar inscrições' });
  }
}) as AuthRequestHandler);

// Get recommended creators
router.get('/creators/recommended', auth, async (req: AuthRequest, res: Response) => {
  try {
    const creators = await Creator.find()
      .select('name profileImage coverImage price')
      .limit(8)
      .lean();

    const userSubs = await Subscription.find({
      subscriberId: req.user!.id,
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
router.get('/content/trending', auth, async (req: AuthRequest, res: Response) => {
  try {
    const trendingContent = await Content.find({ status: 'active' })
      .sort({ likes: -1, createdAt: -1 })
      .limit(6)
      .populate('creatorId', 'name profileImage')
      .lean();

    const userPurchases = await Purchase.find({
      userId: req.user!.id,
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
router.get('/dashboard', auth, checkRole(['subscriber']), async (req: AuthRequest, res: Response) => {
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
router.post('/content/save/:contentId', auth, checkRole(['subscriber']), async (req: AuthRequest, res: Response) => {
  try {
    const { contentId } = req.params;
    const subscriberId = req.user!.id;

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
router.delete('/content/save/:contentId', auth, checkRole(['subscriber']), async (req: AuthRequest, res: Response) => {
  try {
    const { contentId } = req.params;
    const subscriberId = req.user!.id;

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
router.get('/content/saved', auth, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const savedContent = await SavedContent.find({
      subscriberId: req.user!.id
    })
    .populate<{ contentId: PopulatedContent }>({
      path: 'contentId',
      populate: {
        path: 'creatorId',
        select: 'name profileImage'
      }
    })
    .sort('-savedAt')
    .skip(skip)
    .limit(limit)
    .lean();

    const total = await SavedContent.countDocuments({ subscriberId: req.user!.id });

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

router.get('/stats', auth, checkRole(['subscriber']), async (req, res) => {
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

// Rota para listar criadores
router.get('/creators', auth, async (req, res) => {
  try {
    const creators = await Creator.find()
      .select('name email profileImage coverImage price')
      .populate('user', 'name email profileImage');
      
    const creatorsData = creators.map(creator => ({
      id: creator._id,
      name: creator.user.name,
      email: creator.user.email,
      profileImage: creator.user.profileImage,
      coverImage: creator.coverImage,
      price: creator.price
    }));

    res.json(creatorsData);
  } catch (error) {
    console.error('Erro ao buscar criadores:', error);
    res.status(500).json({ message: 'Erro ao buscar criadores' });
  }
});

// Rota para buscar conteúdo de um criador
router.get('/creator/:creatorId/content', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { creatorId } = req.params;
    const subscriberId = req.user!._id;

    const isSubscribed = await Purchase.exists({
      userId: subscriberId,
      creatorId
    });

    const content = await Content.find({ creatorId })
      .populate('creatorId', 'name profileImage')
      .lean();

    const contentData = content.map(item => ({
      id: item._id,
      title: item.title,
      preview: item.preview,
      type: item.type,
      price: item.price,
      likes: item.likes,
      creator: {
        id: item.creatorId._id,
        name: item.creatorId.name,
        profileImage: item.creatorId.profileImage
      },
      isPreview: item.isPreview,
      createdAt: item.createdAt
    }));

    res.json({
      isSubscribed,
      content: contentData
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar conteúdo' });
  }
});

const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const subscriber = await User.findById(req.user!.id)
      .select('-password')
      .lean();

    if (!subscriber) {
      res.status(404).json({ message: 'Assinante não encontrado' });
      return;
    }

    res.json(subscriber);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ message: 'Erro ao buscar perfil' });
  }
};

router.get('/profile', auth, getProfile);

export default router; 