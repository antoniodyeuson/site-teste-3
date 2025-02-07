import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import api from '@/services/api';
import { FiPlus, FiUsers, FiDollarSign, FiEye, FiFileText, FiTrendingUp, FiHeart } from 'react-icons/fi';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import ContentList from '@/components/Dashboard/ContentList';
import SubscribersList from '@/components/Dashboard/SubscribersList';
import UploadModal from '@/components/Dashboard/UploadModal';
import StatCard from '@/components/Dashboard/StatCard';

interface DashboardData {
  stats: {
    subscribers: number;
    earnings: number;
    views: number;
    likes: number;
    contentCount: number;
    subscriberGrowth: number;
    earningsGrowth: number;
    totalUsers: number;
  };
  contents: Array<{
    id: string;
    title: string;
    type: 'image' | 'video' | 'text';
    preview: string;
    views: number;
    likes: number;
    createdAt: string;
  }>;
  subscribers: Array<{
    id: string;
    name: string;
    email: string;
    subscriptionDate: string;
    profileImage?: string;
  }>;
  recentActivities: Array<{
    id: string;
    type: 'subscription' | 'comment' | 'like';
    user: {
      name: string;
      profileImage?: string;
    };
    content?: {
      title: string;
    };
    createdAt: string;
  }>;
}

export default function CreatorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30days');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      if (authLoading) return;
      
      if (user && user.role !== 'creator') {
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/subscriber-dashboard');
        }
        return;
      }

      try {
        const response = await api.get('/creator/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        setError('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [user, router, authLoading]);

  const handleUpload = async (formData: FormData) => {
    try {
      await api.post('/content/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const response = await api.get('/creator/dashboard');
      setData(response.data);
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error('Erro ao fazer upload do conteúdo:', error);
      throw error;
    }
  };

  const handleEditContent = async (content: any) => {
    // Implementar edição de conteúdo
  };

  const handleDeleteContent = async (contentId: string) => {
    try {
      await api.delete(`/content/${contentId}`);
      const response = await api.get('/creator/dashboard');
      setData(response.data);
    } catch (error) {
      console.error('Erro ao excluir conteúdo:', error);
    }
  };

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

  if (!data) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Painel do Criador
          </h1>
          <div className="flex items-center space-x-4">
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <option value="7days">Últimos 7 dias</option>
              <option value="30days">Últimos 30 dias</option>
              <option value="90days">Últimos 90 dias</option>
            </select>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
            >
              <FiPlus className="mr-2" />
              Novo Conteúdo
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total de Usuários"
            value={data.stats.totalUsers}
            icon={FiUsers}
            loading={loading}
          />
          <StatCard
            title="Inscritos"
            value={data.stats.subscribers}
            icon={FiUsers}
            loading={loading}
          />
          <StatCard
            title="Ganhos"
            value={`R$ ${data.stats.earnings.toLocaleString()}`}
            icon={FiDollarSign}
            loading={loading}
          />
          <StatCard
            title="Visualizações"
            value={data.stats.views}
            icon={FiEye}
            loading={loading}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Desempenho
                </h2>
                <FiTrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div className="h-80 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                {/* Adicione aqui o componente de gráfico */}
              </div>
            </div>

            {/* Content List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <ContentList
                contents={data.contents}
                onEdit={handleEditContent}
                onDelete={handleDeleteContent}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscribers List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <SubscribersList subscribers={data.subscribers} />
            </div>

            {/* Recent Activities */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Atividades Recentes
              </h2>
              <div className="space-y-4">
                {data.recentActivities?.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <img
                      src={activity.user.profileImage || '/default-avatar.png'}
                      alt={activity.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{activity.user.name}</span>
                        {' '}
                        {activity.type === 'subscription' && 'se inscreveu no seu canal'}
                        {activity.type === 'comment' && 'comentou em'}
                        {activity.type === 'like' && 'curtiu'}
                        {activity.content && ` "${activity.content.title}"`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {(!data.recentActivities || data.recentActivities.length === 0) && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Nenhuma atividade recente
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleUpload}
        />
      </div>
    </DashboardLayout>
  );
} 