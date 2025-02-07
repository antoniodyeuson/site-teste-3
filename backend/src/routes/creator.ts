import express from 'express';
import { auth, checkRole } from '../middleware/auth';
import Creator from '../models/Creator';
import Content from '../models/Content';
import Subscription from '../models/Subscription';
import { upload } from '../middleware/upload';

const router = express.Router();

// Função auxiliar para calcular ganhos
const calculateEarnings = async (creatorId: string) => {
  try {
    // Busca todas as assinaturas ativas do criador
    const subscriptions = await Subscription.find({
      creatorId,
      status: 'active'
    });

    // Calcula o total de ganhos com assinaturas
    const totalEarnings = subscriptions.reduce((sum, subscription) => {
      // Aplica a taxa da plataforma (15%)
      const platformFee = subscription.price * 0.15;
      const creatorEarning = subscription.price - platformFee;
      return sum + creatorEarning;
    }, 0);

    return totalEarnings;
  } catch (error) {
    console.error('Error calculating earnings:', error);
    return 0;
  }
};

// Get creator profile
router.get('/profile', auth, checkRole(['creator']), async (req, res) => {
  try {
    const creator = await Creator.findById(req.user._id);
    res.json(creator);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update creator profile
router.patch('/profile', auth, checkRole(['creator']), upload.single('profileImage'), async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'bio', 'subscriptionPrice'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    const creator = await Creator.findById(req.user._id);
    if (!creator) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    updates.forEach(update => creator[update] = req.body[update]);
    
    if (req.file) {
      creator.profileImage = req.file.path;
    }

    await creator.save();
    res.json(creator);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get creator analytics
router.get('/analytics', auth, checkRole(['creator']), async (req, res) => {
  try {
    const timeframe = req.query.timeframe || '30days';
    const now = new Date();
    let startDate = new Date();

    switch(timeframe) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    const subscriptions = await Subscription.find({
      creatorId: req.user._id,
      startDate: { $gte: startDate }
    });

    const contentViews = await Content.aggregate([
      {
        $match: {
          creatorId: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' }
        }
      }
    ]);

    res.json({
      newSubscribers: subscriptions.length,
      totalEarnings: subscriptions.reduce((acc, sub) => acc + sub.price, 0),
      contentViews: contentViews[0]?.totalViews || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get creator subscribers
router.get('/subscribers', auth, checkRole(['creator']), async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const subscribers = await Subscription.find({
      creatorId: req.user._id,
      status: 'active'
    })
    .populate('subscriberId', 'name email profileImage')
    .skip(skip)
    .limit(limit)
    .sort({ startDate: -1 });

    const total = await Subscription.countDocuments({
      creatorId: req.user._id,
      status: 'active'
    });

    res.json({
      subscribers,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all creators
router.get('/', async (req, res) => {
  try {
    const creators = await Creator.find()
      .select('name profileImage bio')
      .lean();

    // Add subscriber and content count
    const creatorsWithStats = await Promise.all(
      creators.map(async (creator) => {
        const subscriberCount = await Subscription.countDocuments({
          creatorId: creator._id
        });
        const contentCount = await Content.countDocuments({
          creatorId: creator._id
        });

        return {
          ...creator,
          id: creator._id,
          subscriberCount,
          contentCount
        };
      })
    );

    res.json(creatorsWithStats);
  } catch (error) {
    console.error('Error fetching creators:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get public preview of creators
router.get('/preview', async (req, res) => {
  try {
    const creators = await Creator.find({ status: 'active' })
      .select('name profileImage coverImage bio price')
      .limit(12)
      .lean();

    const creatorsWithStats = await Promise.all(
      creators.map(async (creator) => {
        const subscriberCount = await Subscription.countDocuments({
          creatorId: creator._id,
          status: 'active'
        });

        // Get preview content (limited)
        const previewContent = await Content.find({
          creatorId: creator._id,
          status: 'active',
          isPreview: true
        })
        .select('title thumbnail')
        .limit(3)
        .lean();

        return {
          ...creator,
          id: creator._id,
          subscriberCount,
          previewContent
        };
      })
    );

    res.json(creatorsWithStats);
  } catch (error) {
    console.error('Error fetching creators preview:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get creator dashboard
router.get('/dashboard', auth, checkRole(['creator']), async (req, res) => {
  try {
    const creatorId = req.user.id;

    // Buscar estatísticas
    const [subscribers, contents, earnings] = await Promise.all([
      Subscription.countDocuments({ creatorId, status: 'active' }),
      Content.find({ creatorId }).sort('-createdAt'),
      calculateEarnings(creatorId)
    ]);

    // Calcular total de visualizações e curtidas
    const totalViews = contents.reduce((sum, content) => sum + (content.views || 0), 0);
    const totalLikes = contents.reduce((sum, content) => sum + (content.likes || 0), 0);

    // Buscar inscritos recentes
    const recentSubscribers = await Subscription.find({ 
      creatorId, 
      status: 'active' 
    })
      .populate('subscriberId', 'name email profileImage')
      .sort('-createdAt')
      .limit(5);

    res.json({
      stats: {
        subscribers,
        earnings,
        views: totalViews,
        likes: totalLikes,
        contentCount: contents.length
      },
      contents: contents.map(content => ({
        id: content._id,
        title: content.title,
        type: content.type,
        preview: content.thumbnailUrl || content.url,
        views: content.views || 0,
        likes: content.likes || 0,
        createdAt: content.createdAt
      })),
      subscribers: recentSubscribers.map(sub => ({
        id: sub.subscriberId._id,
        name: sub.subscriberId.name,
        email: sub.subscriberId.email,
        subscriptionDate: sub.createdAt,
        profileImage: sub.subscriberId.profileImage
      }))
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

export default router; 