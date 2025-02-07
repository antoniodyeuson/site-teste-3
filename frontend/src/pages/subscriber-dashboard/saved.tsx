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
  const [savedContent, setSavedContent] = useState<SavedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user || user.role !== 'subscriber') {
      router.push('/login');
      return;
    }
    fetchSavedContent();
  }, [user, router, currentPage]);

  const fetchSavedContent = async () => {
    try {
      const response = await api.get<PaginatedResponse>(`/subscriber/saved?page=${currentPage}`);
      setSavedContent(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Erro ao buscar conteúdo salvo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (contentId: string) => {
    try {
      await api.delete(`/subscriber/saved/${contentId}`);
      setSavedContent(prev => prev.filter(content => content.id !== contentId));
    } catch (error) {
      console.error('Erro ao remover conteúdo:', error);
    }
  };

  if (loading) {
    return (
      <SubscriberLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </SubscriberLayout>
    );
  }

  return (
    <SubscriberLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Conteúdo Salvo</h1>

        {savedContent.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-600 dark:text-gray-400">
              Você ainda não salvou nenhum conteúdo
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedContent.map((content) => (
              <div
                key={content.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="relative aspect-video">
                  <img
                    src={content.preview}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => handleRemove(content.id)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold mb-2">{content.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <img
                      src={content.creator.profileImage}
                      alt={content.creator.name}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span>{content.creator.name}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Salvo em {new Date(content.savedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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