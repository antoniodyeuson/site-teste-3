import { useState, useEffect } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { FiEye, FiTrash2, FiFlag } from 'react-icons/fi';
import api from '@/services/api';
import ContentPreviewModal from '@/components/Admin/ContentPreviewModal';

interface Content {
  id: string;
  title: string;
  type: 'image' | 'video' | 'audio' | 'live';
  creator: {
    name: string;
    email: string;
  };
  status: 'active' | 'pending' | 'removed';
  reportCount: number;
  createdAt: string;
}

export default function ContentModeration() {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchContent();
  }, [currentPage, statusFilter]);

  const fetchContent = async () => {
    try {
      const response = await api.get('/admin/content', {
        params: {
          page: currentPage,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          limit: 10
        }
      });
      setContent(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveContent = async (contentId: string) => {
    if (window.confirm('Are you sure you want to remove this content?')) {
      try {
        await api.delete(`/admin/content/${contentId}`);
        fetchContent();
      } catch (error) {
        console.error('Error removing content:', error);
      }
    }
  };

  const handleStatusChange = async (contentId: string, status: string) => {
    try {
      await api.patch(`/admin/content/${contentId}`, { status });
      fetchContent();
    } catch (error) {
      console.error('Error updating content status:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Content Moderation</h1>
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending Review</option>
              <option value="removed">Removed</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Creator
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reports
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {content.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {item.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.creator.name}</div>
                    <div className="text-sm text-gray-500">{item.creator.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.type === 'video'
                        ? 'bg-blue-100 text-blue-800'
                        : item.type === 'image'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className="text-sm border rounded-md px-2 py-1"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="removed">Removed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.reportCount > 0 && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                        {item.reportCount} reports
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedContent(item)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleRemoveContent(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-md ${
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      {/* Content Preview Modal */}
      {selectedContent && (
        <ContentPreviewModal
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
        />
      )}
    </AdminLayout>
  );
} 