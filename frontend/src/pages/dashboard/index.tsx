import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import DashboardStats from '@/components/Dashboard/DashboardStats';
import ContentList from '@/components/Dashboard/ContentList';
import UploadModal from '@/components/Dashboard/UploadModal';
import { api } from '@/services/api';
import { FiPlus } from 'react-icons/fi';
import { Content } from '@/types';

interface DashboardData {
  stats: {
    subscribers: number;
    earnings: number;
    views: number;
    likes: number;
  };
  recentContent: Content[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: {
      subscribers: 0,
      earnings: 0,
      views: 0,
      likes: 0
    },
    recentContent: []
  });
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/creators/dashboard');
      const formattedContent = response.data.recentContent.map((content: Partial<Content>) => ({
        ...content,
        preview: content.preview || content.url || '',
        isPreview: content.isPreview || false,
        url: content.url || '',
        views: content.views || 0,
        likes: content.likes || 0
      })) as Content[];

      setDashboardData({
        stats: response.data.stats,
        recentContent: formattedContent
      });
      setError('');
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (formData: FormData) => {
    try {
      await api.post('/content', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchDashboardData();
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload do conteúdo');
    }
  };

  const handleEditContent = (content: Content) => {
    console.log('Editar conteúdo:', content);
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este conteúdo?')) {
      return;
    }

    try {
      await api.delete(`/content/${contentId}`);
      fetchDashboardData();
    } catch (err) {
      console.error('Erro ao excluir conteúdo:', err);
      alert('Erro ao excluir conteúdo');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div>Carregando...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Bem-vindo, {user?.name}
          </h1>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="btn-primary flex items-center"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Novo Conteúdo
          </button>
        </div>

        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <>
            <DashboardStats stats={dashboardData.stats} />
            <ContentList
              contents={dashboardData.recentContent}
              onEdit={handleEditContent}
              onDelete={handleDeleteContent}
            />
          </>
        )}

        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleUpload}
        />
      </div>
    </DashboardLayout>
  );
} 