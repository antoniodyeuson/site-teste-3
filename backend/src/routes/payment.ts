import express, { Router, Response } from 'express';
import { auth, checkRole } from '../middleware/auth';
import { 
  createStripeAccount, 
  createSubscription, 
  createPaymentIntent 
} from '../services/stripe';
import Creator from '../models/Creator';
import Subscription from '../models/Subscription';
import { AuthRequest, AuthRequestHandler } from '../types/express';
import { Creator as CreatorType } from '../types';
import Tip from '../models/Tip';
import Transaction from '../models/Transaction';
import stripe from '../services/stripe';
import User from '../models/User';

const router = Router();

interface CreatorWithStripe extends CreatorType {
  stripePriceId?: string;
  stripeAccountId?: string;
}

interface PaymentBody {
  amount: number;
  creatorId: string;
}

// Connect Stripe account
router.post('/connect-stripe', auth, checkRole(['creator']), async (req: AuthRequest, res: Response) => {
  try {
    const creator = await Creator.findById(req.user!.id).populate('user');
    if (!creator) {
      res.status(404).json({ message: 'Criador não encontrado' });
      return;
    }

    const account = await createStripeAccount(creator.user.email);
    creator.stripeAccountId = account.id;
    await creator.save();

    res.json({ accountId: account.id });
  } catch (error) {
    console.error('Erro ao conectar Stripe:', error);
    res.status(500).json({ message: 'Erro ao conectar Stripe' });
  }
});

// Subscribe to creator
router.post('/subscribe/:creatorId', auth, async (req: AuthRequest, res: Response) => {
  try {
    const creator = await Creator.findById(req.params.creatorId);
    if (!creator) {
      res.status(404).json({ message: 'Criador não encontrado' });
      return;
    }

    const user = await User.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    if (!creator.stripeAccountId || !creator.stripePriceId) {
      res.status(400).json({ message: 'Conta Stripe do criador não configurada corretamente' });
      return;
    }

    // Verificar se já existe assinatura ativa
    const existingSubscription = await Subscription.findOne({
      subscriberId: user._id,
      creatorId: creator._id,
      status: 'active'
    });

    if (existingSubscription) {
      res.status(400).json({ message: 'Assinatura já existe' });
      return;
    }

    // Criar assinatura no Stripe
    const subscription = await createSubscription(
      user.stripeCustomerId!,
      creator.stripePriceId,
      creator.stripeAccountId
    );

    res.json(subscription);
  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
    res.status(500).json({ message: 'Erro ao processar assinatura' });
  }
});

// Cancel subscription
router.post('/cancel-subscription/:subscriptionId', auth, async (req: AuthRequest, res: Response) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.subscriptionId,
      subscriberId: req.user!.id
    });

    if (!subscription) {
      res.status(404).json({ message: 'Assinatura não encontrada' });
      return;
    }

    subscription.status = 'cancelled';
    await subscription.save();

    res.json({ message: 'Assinatura cancelada' });
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    res.status(500).json({ message: 'Erro ao cancelar assinatura' });
  }
});

// Add to existing payment.ts
router.post('/tip', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { creatorId, amount, message } = req.body;
    
    const creator = await Creator.findById(creatorId).populate('user');
    if (!creator) {
      return res.status(404).json({ message: 'Criador não encontrado' });
    }

    if (!creator.allowTips) {
      return res.status(400).json({ message: 'Este criador não aceita gorjetas' });
    }

    if (amount < creator.minimumTipAmount) {
      return res.status(400).json({ 
        message: `Valor mínimo de gorjeta é R$ ${creator.minimumTipAmount}` 
      });
    }

    if (!creator.stripeAccountId) {
      return res.status(400).json({ message: 'Conta Stripe não configurada' });
    }

    // Criar pagamento no Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'brl',
      customer: req.user!.stripeCustomerId,
      transfer_data: {
        destination: creator.stripeAccountId,
      },
    });

    // Criar gorjeta no banco
    const tip = new Tip({
      senderId: req.user!.id,
      receiverId: creatorId,
      amount,
      message
    });

    await tip.save();

    // Criar transação
    const transaction = new Transaction({
      creatorId,
      userId: req.user!.id,
      type: 'tip',
      amount,
      status: 'pending',
      stripePaymentId: paymentIntent.id
    });

    await transaction.save();

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      tipId: tip._id 
    });
  } catch (error) {
    console.error('Erro ao processar gorjeta:', error);
    res.status(500).json({ message: 'Erro ao processar gorjeta' });
  }
});

router.post('/create-payment-intent', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user!.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // ... resto do código ...
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    res.status(500).json({ message: 'Erro ao processar pagamento' });
  }
});

router.post('/payment', auth, async (req: AuthRequest, res: Response) => {
  const { amount, creatorId } = req.body;
  try {
    // ... resto do código ...
    res.json({ /* ... */ });
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    res.status(500).json({ message: 'Erro ao processar pagamento' });
  }
});

export default router; 