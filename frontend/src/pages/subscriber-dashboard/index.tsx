import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import api from '@/services/api';
import { FiHeart, FiBookmark, FiClock, FiTrendingUp, FiPlay, FiUsers, FiDollarSign, FiCreditCard } from 'react-icons/fi';
import SubscriberLayout from '@/components/Subscriber/SubscriberLayout';
import Link from 'next/link';
import StatCard from '@/components/Dashboard/StatCard';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import axios from 'axios';

interface DashboardData {
  stats: {
    totalSubscriptions: number;
    savedContent: number;
    watchedContent: number;
    totalInteractions: number;
    activeSubscriptions: number;
  };
  subscriptions: Array<{
    id: string;
    creator: {
      id: string;
      name: string;
      profileImage?: string;
    };
    startDate: string;
  }>;
  recentContent: Array<{
    id: string;
    title: string;
    preview: string;
    creatorName: string;
  }>;
  savedContent: Array<{
    id: string;
    title: string;
    preview: string;
    creatorName: string;
  }>;
}

interface DashboardStats {
  totalSubscriptions: number;
  totalSpent: number;
  savedContent: number;
  activeSubscriptions: number;
}

export default function SubscriberDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    totalSubscriptions: 0,
    totalSpent: 0,
    savedContent: 0,
    activeSubscriptions: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (authLoading) return;
      if (!user) return;

      try {
        const response = await api.get('/subscriber/stats');
        const statsData: DashboardData = {
          stats: {
            totalSubscriptions: response.data.totalSubscriptions || 0,
            savedContent: response.data.savedContent || 0,
            watchedContent: response.data.watchedContent || 0,
            totalInteractions: response.data.totalInteractions || 0,
            activeSubscriptions: response.data.activeSubscriptions || 0
          },
          subscriptions: response.data.subscriptions || [],
          recentContent: response.data.recentContent || [],
          savedContent: response.data.savedContent || []
        };
        setData(statsData);
        setStats(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status !== 401) {
          console.error('Erro ao buscar dados do dashboard:', error);
          setError('Erro ao carregar dados do dashboard');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
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

  if (!data?.stats) {
    return (
      <DashboardLayout>
        <div className="text-center p-4">Nenhum dado disponível</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Dashboard do Assinante
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total de Inscrições"
            value={stats.totalSubscriptions.toString()}
            icon={<FiHeart className="w-6 h-6" />}
            description="Inscrições realizadas"
          />

          <StatCard
            title="Total Gasto"
            value={`R$ ${stats.totalSpent.toFixed(2)}`}
            icon={<FiDollarSign className="w-6 h-6" />}
            description="Em todas as inscrições"
          />

          <StatCard
            title="Conteúdos Salvos"
            value={stats.savedContent.toString()}
            icon={<FiBookmark className="w-6 h-6" />}
            description="Itens na sua lista"
          />

          <StatCard
            title="Inscrições Ativas"
            value={stats.activeSubscriptions.toString()}
            icon={<FiCreditCard className="w-6 h-6" />}
            description="Assinaturas vigentes"
          />
        </div>
      </div>
    </DashboardLayout>
  );
} 