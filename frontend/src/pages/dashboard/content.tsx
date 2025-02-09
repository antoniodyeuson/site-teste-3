import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { api } from '@/services/api';
import { FiPlus, FiEye, FiDollarSign, FiLock, FiUnlock } from 'react-icons/fi';
import UploadModal from '@/components/Dashboard/UploadModal';

interface Content {
  _id: string;
  title: string;
  description?: string;
  type: 'image' | 'video' | 'audio' | 'text';
  url: string;
  preview?: string;
  isPreview: boolean;
  price: number;
  views?: number;
  revenue?: number;
  createdAt: string;
}

const LoadingState = () => (
  <DashboardLayout>
    <div className="p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-100 h-48 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  </DashboardLayout>
);

const ErrorState = ({ message }: { message: string }) => (
  <DashboardLayout>
    <div className="p-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Erro</h2>
        <p className="text-gray-600">{message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  </DashboardLayout>
);

export default function ContentPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await api.get('/creator/content');
      setContents(response.data);
    } catch (error) {
      console.error('Erro ao buscar conteúdos:', error);
      setError('Erro ao carregar conteúdos');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    setIsModalOpen(false);
    fetchContents();
  };

  const handleUpload = async (formData: FormData) => {
    try {
      await api.post('/content', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      handleUploadSuccess();
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
    }
  };

  const filteredContents = contents.filter(content => {
    if (filter === 'public') return content.isPreview;
    if (filter === 'private') return !content.isPreview;
    return true;
  });

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Meus Conteúdos</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FiPlus /> Novo Conteúdo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map(content => (
            <div key={content._id} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-2">{content.title}</h3>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                {content.isPreview ? <FiUnlock /> : <FiLock />}
                <span>
                  {content.isPreview ? 'Público' : 'Privado'}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <FiEye />
                  <span>{content.views || 0} visualizações</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiDollarSign />
                  <span>R$ {content.revenue || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <UploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpload={handleUpload}
        />
      </div>
    </DashboardLayout>
  );
} 