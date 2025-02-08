import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import api from '@/services/api';
import { FiPlus, FiUsers, FiDollarSign, FiEye, FiFileText, FiTrendingUp, FiHeart, FiUpload } from 'react-icons/fi';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import ContentList from '@/components/Dashboard/ContentList';
import SubscribersList from '@/components/Dashboard/SubscribersList';
import UploadModal from '@/components/Dashboard/UploadModal';
import StatCard from '@/components/Dashboard/StatCard';
import DashboardStats from '@/components/Dashboard/DashboardStats';

interface DashboardData {
  earnings: number;
  contentCount: number;
  subscriberCount: number;
  recentContent?: Array<{
    id: string;
    title: string;
    type: string;
    createdAt: string;
  }>;
  recentSubscribers?: Array<{
    id: string;
    name: string;
    profileImage?: string;
    subscribedAt: string;
  }>;
}

export default function CreatorDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'creator') {
      router.push('/');
      return;
    }

    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/creators/dashboard');
      setData(response.data);
      setError('');
    } catch (error: any) {
      console.error('Erro ao buscar dados do dashboard:', error);
      setError(error.response?.data?.message || 'Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (formData: FormData) => {
    try {
      await api.post('/creators/content', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await fetchDashboardData();
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw error;
    }
  };

  const handleEditContent = async (content: any) => {
    // Implementar edição de conteúdo
  };

  const handleDeleteContent = async (contentId: string) => {
    try {
      await api.delete(`/content/${contentId}`);
      await fetchDashboardData();
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
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <FiUpload className="w-5 h-5 mr-2" />
            Novo Conteúdo
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            {error}
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Ganhos</h3>
              <p className="text-2xl font-bold text-primary">
                R$ {data.earnings.toFixed(2)}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Conteúdos</h3>
              <p className="text-2xl font-bold text-primary">
                {data.contentCount}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Inscritos</h3>
              <p className="text-2xl font-bold text-primary">
                {data.subscriberCount}
              </p>
            </div>
          </div>
        )}
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />
    </DashboardLayout>
  );
} 