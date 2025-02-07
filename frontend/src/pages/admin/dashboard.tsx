import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import StatCard from '@/components/Dashboard/StatCard';
import { FiUsers, FiDollarSign, FiFileText, FiAlertCircle } from 'react-icons/fi';
import api from '@/services/api';
import { useRouter } from 'next/router';

interface AdminStats {
  totalUsers: number;
  revenue: number;
  totalContent: number;
  pendingReports: number;
  userGrowth: number;
  revenueGrowth: number;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      if (authLoading) return;
      
      if (user && user.role !== 'admin') {
        if (user.role === 'creator') {
          router.push('/dashboard');
        } else {
          router.push('/subscriber-dashboard');
        }
        return;
      }

      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        setError('Erro ao carregar estatísticas');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [user, router, authLoading]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-600 p-4">{error}</div>
      </DashboardLayout>
    );
  }

  if (!stats) return null;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard Administrativo
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Usuários"
            value={stats.totalUsers}
            trend={{
              value: stats.userGrowth,
              isPositive: stats.userGrowth > 0
            }}
            icon={<FiUsers className="w-6 h-6" />}
          />
          <StatCard
            title="Receita"
            value={`R$ ${stats.revenue.toLocaleString()}`}
            trend={{
              value: stats.revenueGrowth,
              isPositive: stats.revenueGrowth > 0
            }}
            icon={<FiDollarSign className="w-6 h-6" />}
          />
          <StatCard
            title="Conteúdos"
            value={stats.totalContent}
            icon={<FiFileText className="w-6 h-6" />}
          />
          <StatCard
            title="Denúncias"
            value={stats.pendingReports}
            icon={<FiAlertCircle className="w-6 h-6" />}
          />
        </div>

        {/* Adicione mais seções conforme necessário */}
      </div>
    </DashboardLayout>
  );
} 