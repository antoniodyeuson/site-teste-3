import express from 'express';
import { auth, checkRole } from '../middleware/auth';
import Creator from '../models/Creator';
import Withdrawal from '../models/Withdrawal';
import Transaction from '../models/Transaction';
import { AuthRequest } from '../types/express';
import stripe from '../services/stripe';

const router = express.Router();

// Get withdrawal stats
router.get('/stats', auth, checkRole(['creator']), async (req: AuthRequest, res) => {
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
    console.error('Erro ao buscar estatísticas de saque:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
});

// Get withdrawal history
router.get('/history', auth, checkRole(['creator']), async (req: AuthRequest, res) => {
  try {
    const withdrawals = await Withdrawal.find({ creatorId: req.user!.id })
      .sort('-createdAt');

    res.json(withdrawals);
  } catch (error) {
    console.error('Erro ao buscar histórico de saques:', error);
    res.status(500).json({ message: 'Erro ao buscar histórico' });
  }
});

// Request withdrawal
router.post('/request', auth, checkRole(['creator']), async (req: AuthRequest, res) => {
  try {
    const { amount } = req.body;
    const creator = await Creator.findById(req.user!.id);

    if (!creator) {
      return res.status(404).json({ message: 'Criador não encontrado' });
    }

    if (!creator.bankInfo?.verified) {
      return res.status(400).json({ 
        message: 'Dados bancários não verificados' 
      });
    }

    // Verificar saldo disponível
    const availableTransactions = await Transaction.find({
      creatorId: creator._id,
      status: 'completed',
      createdAt: { 
        $lt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) 
      }
    });

    const availableBalance = availableTransactions.reduce(
      (sum, tx) => sum + tx.amount, 
      0
    );

    if (amount > availableBalance) {
      return res.status(400).json({ message: 'Saldo insuficiente' });
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