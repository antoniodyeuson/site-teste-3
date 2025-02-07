import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth';
import { isAdmin } from '../middlewares/roles';

const router = Router();

// Rota de teste sem autenticação para debug
router.get('/test', (req, res) => {
  console.log('Rota de teste admin acessada');
  res.json({ message: 'Admin route working' });
});

router.get('/stats', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const stats = {
      totalUsers: 150,
      revenue: 15000,
      totalContent: 324,
      pendingReports: 5,
      userGrowth: 12,
      revenueGrowth: 8
    };

    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

export default router; 