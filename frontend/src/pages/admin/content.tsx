import { useState, useEffect } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { FiEye, FiTrash2, FiFlag } from 'react-icons/fi';
import api from '@/services/api';
import ContentPreviewModal from '@/components/Admin/ContentPreviewModal';
import { Content } from '@/types/content';

export default function AdminContentPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await api.get('/admin/content');
      setContents(response.data);
    } catch (error) {
      console.error('Erro ao buscar conteúdos:', error);
      setError('Erro ao carregar conteúdos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Conteúdos">
        <div className="animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Conteúdos">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Tentar novamente
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Conteúdos">
      <div className="grid gap-6">
        {contents.map(content => (
          <div 
            key={content._id} 
            className="bg-white p-4 rounded-lg shadow cursor-pointer"
            onClick={() => setSelectedContent(content)}
          >
            <h3 className="font-semibold">{content.title}</h3>
            <p className="text-sm text-gray-500">{content.description}</p>
            <div className="mt-2 flex items-center gap-4 text-sm">
              <span>Tipo: {content.type}</span>
              <span>Visualização: {content.isPreview ? 'Pública' : 'Privada'}</span>
              <span>Criador: {content.creator?.name || 'Não informado'}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedContent && (
        <ContentPreviewModal
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
        />
      )}
    </AdminLayout>
  );
} 