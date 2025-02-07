import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import api from '@/services/api';
import { FiPlus } from 'react-icons/fi';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import DashboardStats from '@/components/Dashboard/DashboardStats';
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
}

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'creator') {
      router.push('/login');
      return;
    }
    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/creator/dashboard');
      setData(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados do painel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (formData: FormData) => {
    try {
      await api.post('/api/content/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchDashboardData(); // Recarrega os dados após o upload
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
      await api.delete(`/api/content/${contentId}`);
      fetchDashboardData();
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

  if (!data) return null;

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Painel do Criador</h1>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            <FiPlus className="mr-2" />
            Novo Conteúdo
          </button>
        </div>

        <div className="stats">
          <StatCard title="Inscritos" value={data.stats.subscribers} />
          <StatCard title="Visualizações" value={data.stats.views} />
          <StatCard title="Ganhos" value={`R$ ${data.stats.earnings}`} />
          <StatCard title="Conteúdos" value={data.stats.contentCount} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ContentList
              contents={data.contents}
              onEdit={handleEditContent}
              onDelete={handleDeleteContent}
            />
          </div>
          <div>
            <SubscribersList subscribers={data.subscribers} />
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