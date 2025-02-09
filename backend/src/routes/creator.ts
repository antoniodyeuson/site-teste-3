import express, { Router, Response } from 'express';
import { auth, checkRole } from '../middleware/auth';
import Creator from '../models/Creator';
import Content from '../models/Content';
import Subscription from '../models/Subscription';
import { upload } from '../middleware/upload';
import { AuthRequest, AuthRequestHandler } from '../types/express';
import { calculateEarnings } from '../utils/earnings';
import mongoose from 'mongoose';
import Purchase from '../models/Purchase';
import Transaction from '../models/Transaction';
import stripe from '../services/stripe';
import { Creator as CreatorType } from '../types';
import bcrypt from 'bcrypt';
import Withdrawal from '../models/Withdrawal';
import User from '../models/User';

const router = Router();

// Get creator profile
router.get('/profile', auth, checkRole(['creator']), async (req: AuthRequest, res: Response) => {
  try {
    const creator = await Creator.findById(req.user!.id)
      .select('email name cpf birthDate phone verificationStatus')
      .lean()
      .populate('user');

    if (!creator) {
      res.status(404).json({ message: 'Criador não encontrado' });
      return;
    }

    res.json(creator);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ message: 'Erro ao buscar perfil' });
  }
});

// Get creator content
router.get('/content', auth, checkRole(['creator']), async (req: AuthRequest, res: Response) => {
  try {
    const content = await Content.find({ creatorId: req.user!.id })
      .sort('-createdAt')
      .lean();

    res.json(content);
  } catch (error) {
    console.error('Erro ao buscar conteúdos:', error);
    res.status(500).json({ message: 'Erro ao buscar conteúdos' });
  }
});

// Update profile
router.patch('/profile', auth, checkRole(['creator']), async (req: AuthRequest, res: Response) => {
  try {
    const { name, cpf, birthDate, phone } = req.body;
    const creator = await Creator.findByIdAndUpdate(
      req.user!.id,
      { name, cpf, birthDate, phone },
      { new: true }
    );

    if (!creator) {
      res.status(404).json({ message: 'Criador não encontrado' });
      return;
    }

    res.json(creator);
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro ao atualizar perfil' });
  }
});

// Update bank info
router.patch('/bank-info', auth, checkRole(['creator']), async (req: AuthRequest, res: Response) => {
  try {
    const { bankName, accountType, agency, accountNumber, pixKey } = req.body;
    const creator = await Creator.findById(req.user!.id);

    if (!creator) {
      res.status(404).json({ message: 'Criador não encontrado' });
      return;
    }

    // Atualizar dados bancários
    creator.bankInfo = {
      bankName,
      accountType,
      agency,
      accountNumber,
      pixKey,
      verified: false // Requer nova verificação
    };

    creator.verificationStatus.bankVerified = false;
    await creator.save();

    // Iniciar processo de verificação bancária
    try {
      // Implementar verificação bancária aqui
      // Se sucesso:
      creator.bankInfo.verified = true;
      creator.verificationStatus.bankVerified = true;
      await creator.save();
    } catch (verifyError) {
      console.error('Erro na verificação bancária:', verifyError);
    }

    res.json(creator);
  } catch (error) {
    console.error('Erro ao atualizar dados bancários:', error);
    res.status(500).json({ message: 'Erro ao atualizar dados bancários' });
  }
});

// Update notifications
router.patch('/notifications', auth, checkRole(['creator']), async (req: AuthRequest, res: Response) => {
  try {
    const creator = await Creator.findById(req.user!.id);
    if (!creator) {
      res.status(404).json({ message: 'Criador não encontrado' });
      return;
    }

    creator.notifications = {
      ...creator.notifications,
      ...req.body
    };

    await creator.save();
    res.json(creator);
  } catch (error) {
    console.error('Erro ao atualizar notificações:', error);
    res.status(500).json({ message: 'Erro ao atualizar notificações' });
  }
});

// Update password
router.patch('/password', auth, checkRole(['creator']), async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const creator = await Creator.findById(req.user!.id).populate('user');

    if (!creator) {
      res.status(404).json({ message: 'Criador não encontrado' });
      return;
    }

    // Verificar senha atual
    const isMatch = await bcrypt.compare(currentPassword, creator.user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Senha atual incorreta' });
      return;
    }

    // Hash nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(creator.user._id, { password: hashedPassword });

    res.json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).json({ message: 'Erro ao atualizar senha' });
  }
});

// Upload profile image
router.post('/profile-image', 
  auth, 
  checkRole(['creator']), 
  upload.single('image'), 
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'Nenhuma imagem enviada' });
        return;
      }

      const creator = await Creator.findById(req.user!.id).populate('user');
      if (!creator) {
        res.status(404).json({ message: 'Criador não encontrado' });
        return;
      }

      const user = await User.findById(creator.user._id);
      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado' });
        return;
      }

      // Atualizar URL da imagem no usuário
      user.profileImage = req.file.path;
      await user.save();

      res.json({ profileImage: user.profileImage });
    } catch (error) {
      console.error('Erro ao atualizar imagem:', error);
      res.status(500).json({ message: 'Erro ao atualizar imagem' });
    }
  }
);

// Get creator analytics
router.get('/analytics', auth, checkRole(['creator']), (async (req: AuthRequest, res: Response) => {
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
      creatorId: req.user!.id,
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
}) as AuthRequestHandler);

// Get creator subscribers
router.get('/subscribers', auth, checkRole(['creator']), (async (req: AuthRequest, res: Response) => {
  try {
    const creatorId = req.user!.id;

    const subscriptions = await Subscription.find({ 
      creatorId,
      status: { $in: ['active', 'expired'] }
    })
    .populate<{ subscriberId: CreatorType }>('subscriberId', 'name email profileImage')
    .sort('-createdAt')
    .lean();

    // Buscar informações adicionais para cada inscrito
    const subscribersWithDetails = await Promise.all(
      subscriptions.map(async (sub) => {
        const purchases = await Purchase.find({
          userId: sub.subscriberId._id,
          creatorId
        });

        const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.price, 0);

        return {
          id: sub.subscriberId._id,
          name: sub.subscriberId.name,
          email: sub.subscriberId.email,
          profileImage: sub.subscriberId.profileImage,
          subscriptionDate: sub.startDate,
          totalSpent,
          status: sub.status
        };
      })
    );

    res.json(subscribersWithDetails);
  } catch (error) {
    console.error('Erro ao buscar inscritos:', error);
    res.status(500).json({ message: 'Erro ao buscar inscritos' });
  }
}) as AuthRequestHandler);

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
router.get('/dashboard', auth, checkRole(['creator']), (async (req: AuthRequest, res: Response) => {
  try {
    const creatorId = req.user!.id;

    // Busca dados em paralelo para melhor performance
    const [
      subscriptions,
      content,
      earnings
    ] = await Promise.all([
      Subscription.countDocuments({ 
        creatorId, 
        status: 'active' 
      }),
      Content.find({ creatorId })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      calculateEarnings(creatorId)
    ]);

    // Calcula estatísticas totais do conteúdo
    const contentStats = await Content.aggregate([
      { $match: { creatorId: new mongoose.Types.ObjectId(creatorId) } },
      { 
        $group: {
          _id: null,
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: '$likes' }
        }
      }
    ]);

    const stats = {
      subscribers: subscriptions,
      earnings,
      views: contentStats[0]?.totalViews || 0,
      likes: contentStats[0]?.totalLikes || 0
    };

    res.json({
      stats,
      recentContent: content
    });

  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json({ message: 'Erro ao buscar dados do dashboard' });
  }
}) as AuthRequestHandler);

// Rota pública para explorar criadores
router.get('/explore', async (req, res) => {
  try {
    const creators = await Creator.find({ role: 'creator' })
      .select('name profileImage coverImage bio price subscriberCount')
      .sort('-subscriberCount')
      .limit(20)
      .lean();

    const creatorsWithPreview = await Promise.all(
      creators.map(async (creator) => {
        // Busca alguns conteúdos de preview do criador
        const previewContent = await Content.find({
          creatorId: creator._id,
          isPreview: true
        })
        .select('title preview')
        .limit(3)
        .lean();

        return {
          ...creator,
          previewContent
        };
      })
    );

    res.json(creatorsWithPreview);
  } catch (error) {
    console.error('Erro ao buscar criadores:', error);
    res.status(500).json({ message: 'Erro ao buscar criadores' });
  }
});

// Get finance stats
router.get('/finances/stats', auth, checkRole(['creator']), (async (req: AuthRequest, res: Response) => {
  try {
    const creatorId = req.user!.id;
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Buscar todas as transações
    const [subscriptions, purchases, tips] = await Promise.all([
      Subscription.find({
        creatorId,
        status: 'active',
        startDate: { $gte: firstDayOfMonth }
      }),
      Purchase.find({
        creatorId,
        createdAt: { $gte: firstDayOfMonth }
      }),
      // Implementar modelo de gorjetas se necessário
      []
    ]);

    // Calcular estatísticas
    const monthlyEarnings = subscriptions.reduce((sum, sub) => sum + sub.price, 0) +
      purchases.reduce((sum, purchase) => sum + purchase.price, 0);

    const stats = {
      totalEarnings: await calculateEarnings(creatorId),
      monthlyEarnings,
      pendingPayout: monthlyEarnings * 0.85, // 15% de taxa da plataforma
      subscriberRevenue: subscriptions.reduce((sum, sub) => sum + sub.price, 0),
      contentSales: purchases.reduce((sum, purchase) => sum + purchase.price, 0),
      tipsReceived: 0 // Implementar quando adicionar sistema de gorjetas
    };

    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas financeiras:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas financeiras' });
  }
}) as AuthRequestHandler);

// Get earnings history
router.get('/finances/history', auth, checkRole(['creator']), (async (req: AuthRequest, res: Response) => {
  try {
    const creatorId = req.user!.id;
    const period = req.query.period || '30days';
    const now = new Date();
    let startDate = new Date();

    switch(period) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(now.getDate() - 90);
        break;
    }

    const transactions = await Transaction.aggregate([
      {
        $match: {
          creatorId: new mongoose.Types.ObjectId(creatorId),
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          amount: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    const history = transactions.map(t => ({
      date: t._id,
      amount: t.amount
    }));

    res.json(history);
  } catch (error) {
    console.error('Erro ao buscar histórico financeiro:', error);
    res.status(500).json({ message: 'Erro ao buscar histórico financeiro' });
  }
}) as AuthRequestHandler);

// Get creator settings
router.get('/settings', auth, checkRole(['creator']), async (req: AuthRequest, res: Response) => {
  try {
    const creator = await Creator.findById(req.user!.id)
      .select('settings notifications bankInfo')
      .lean();

    if (!creator) {
      res.status(404).json({ message: 'Criador não encontrado' });
      return;
    }

    res.json(creator);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.status(500).json({ message: 'Erro ao buscar configurações' });
  }
});

// Update settings
router.patch('/settings', auth, checkRole(['creator']), async (req: AuthRequest, res: Response) => {
  try {
    const creator = await Creator.findByIdAndUpdate(
      req.user!.id,
      { $set: { settings: req.body } },
      { new: true }
    );

    if (!creator) {
      res.status(404).json({ message: 'Criador não encontrado' });
      return;
    }

    res.json(creator);
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    res.status(500).json({ message: 'Erro ao atualizar configurações' });
  }
});

// Connect Stripe account
router.post('/stripe/connect', auth, checkRole(['creator']), async (req: AuthRequest, res: Response) => {
  try {
    const creator = await Creator.findById(req.user!.id).populate('user');
    if (!creator) {
      res.status(404).json({ message: 'Criador não encontrado' });
      return;
    }

    if (creator.stripeAccountId) {
      res.status(400).json({ message: 'Conta Stripe já conectada' });
      return;
    }

    const account = await stripe.accounts.create({
      type: 'express',
      country: 'BR',
      email: creator.user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true }
      }
    });

    creator.stripeAccountId = account.id;
    await creator.save();

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.FRONTEND_URL}/dashboard/settings`,
      return_url: `${process.env.FRONTEND_URL}/dashboard/settings`,
      type: 'account_onboarding'
    });

    res.json({ url: accountLink.url });
  } catch (error) {
    console.error('Erro ao conectar conta Stripe:', error);
    res.status(500).json({ message: 'Erro ao conectar conta Stripe' });
  }
});

// Withdrawal routes
router.get('/withdrawals/stats', auth, checkRole(['creator']), (async (req: AuthRequest, res: Response) => {
  try {
    const creatorId = req.user!.id;

    // Buscar transações pendentes (menos de 15 dias para cartão)
    const pendingTransactions = await Transaction.find({
      creatorId,
      status: 'completed',
      createdAt: { 
        $gte: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) 
      }
    });

    // Buscar transações disponíveis
    const availableTransactions = await Transaction.find({
      creatorId,
      status: 'completed',
      createdAt: { 
        $lt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) 
      }
    });

    // Calcular saldos
    const pendingBalance = pendingTransactions.reduce(
      (sum, tx) => sum + tx.amount, 
      0
    );

    const availableBalance = availableTransactions.reduce(
      (sum, tx) => sum + tx.amount, 
      0
    );

    // Buscar total sacado
    const withdrawals = await Withdrawal.find({
      creatorId,
      status: 'completed'
    });

    const totalWithdrawn = withdrawals.reduce(
      (sum, w) => sum + w.amount, 
      0
    );

    res.json({
      pendingBalance,
      availableBalance,
      totalWithdrawn
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
}) as AuthRequestHandler);

router.get('/withdrawals/history', auth, checkRole(['creator']), (async (req: AuthRequest, res: Response) => {
  try {
    const withdrawals = await Withdrawal.find({ 
      creatorId: req.user!.id 
    }).sort('-createdAt');

    res.json(withdrawals);
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ message: 'Erro ao buscar histórico' });
  }
}) as AuthRequestHandler);

router.post('/withdrawals/request', auth, checkRole(['creator']), async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body;
    const creator = await Creator.findById(req.user!.id);

    if (!creator) {
      res.status(404).json({ message: 'Criador não encontrado' });
      return;
    }

    if (!creator.bankInfo?.verified) {
      res.status(400).json({ message: 'Dados bancários não verificados' });
      return;
    }

    // Verificar saldo disponível
    const availableBalance = await calculateEarnings(creator._id);
    if (amount > availableBalance) {
      res.status(400).json({ message: 'Saldo insuficiente' });
      return;
    }

    // Criar solicitação de saque
    const withdrawal = new Withdrawal({
      creatorId: creator._id,
      amount,
      paymentMethod: creator.bankInfo.pixKey ? 'pix' : 'bank_transfer'
    });

    await withdrawal.save();

    // Se tiver PIX, processar imediatamente
    if (creator.bankInfo.pixKey) {
      // Implementar integração com gateway de pagamento para PIX
      withdrawal.status = 'completed';
      withdrawal.completedAt = new Date();
      await withdrawal.save();
    }

    res.json(withdrawal);
  } catch (error) {
    console.error('Erro ao solicitar saque:', error);
    res.status(500).json({ message: 'Erro ao processar solicitação' });
  }
});

export default router; 