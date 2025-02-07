import { useState, useEffect } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { FiEye, FiTrash2, FiFlag } from 'react-icons/fi';
import api from '@/services/api';
import ContentPreviewModal from '@/components/Admin/ContentPreviewModal';

interface Content {
  id: string;
  title: string;
  type: string;
  url: string;
  creator: {
    name: string;
  };
  createdAt: string;
}

export default function AdminContent() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await api.get('/admin/contents');
        setContents(response.data);
      } catch (error) {
        console.error('Erro ao buscar conteúdos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  return (
    <AdminLayout title="Conteúdo">
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Criador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center">
                    Carregando...
                  </td>
                </tr>
              ) : (
                contents.map((content) => (
                  <tr
                    key={content.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => setSelectedContent(content)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{content.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {content.creator.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{content.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(content.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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