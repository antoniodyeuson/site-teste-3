import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import api from '@/services/api';
import SubscriberLayout from '@/components/Subscriber/SubscriberLayout';
import { FiHeart, FiTrash2 } from 'react-icons/fi';

interface SavedContent {
  id: string;
  title: string;
  preview: string;
  type: string;
  savedAt: string;
  creator: {
    id: string;
    name: string;
    profileImage: string;
  };
}

interface PaginatedResponse {
  items: SavedContent[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export default function SavedContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!user || user.role !== 'subscriber') {
      router.push('/login');
      return;
    }
    fetchSavedContent(currentPage);
  }, [user, router, currentPage]);

  const fetchSavedContent = async (page: number) => {
    try {
      const response = await api.get(`/api/subscriber/content/saved?page=${page}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching saved content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (contentId: string) => {
    try {
      await api.delete(`/api/subscriber/content/save/${contentId}`);
      fetchSavedContent(currentPage); // Recarrega a lista
    } catch (error) {
      console.error('Error removing content:', error);
    }
  };

  if (loading) {
    return (
      <SubscriberLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </SubscriberLayout>
    );
  }

  return (
    <SubscriberLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8">Conteúdos Salvos</h1>

        {data?.items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Você ainda não salvou nenhum conteúdo</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.items.map((content) => (
              <div key={content.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="relative">
                  <img
                    src={content.preview}
                    alt={content.title}
                    className="w-full h-48 object-cover"
                  />
                  <span className={`absolute top-2 right-2 px-2 py-1 rounded text-xs text-white ${
                    content.type === 'video' ? 'bg-purple-500' : 'bg-blue-500'
                  }`}>
                    {content.type}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-center mb-4">
                    <img
                      src={content.creator.profileImage}
                      alt={content.creator.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="ml-2 text-sm font-medium">{content.creator.name}</span>
                  </div>

                  <h3 className="font-medium mb-2">{content.title}</h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      Salvo em {new Date(content.savedAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleRemove(content.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remover dos salvos"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginação */}
        {data && data.totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </SubscriberLayout>
  );
} 