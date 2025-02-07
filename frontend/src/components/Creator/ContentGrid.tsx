import { useState, useEffect } from 'react';
import api from '@/services/api';
import { FiImage, FiVideo, FiMusic, FiPlay } from 'react-icons/fi';

interface Content {
  id: string;
  type: 'image' | 'video' | 'audio' | 'live';
  thumbnailUrl: string;
  title: string;
  createdAt: Date;
}

interface ContentGridProps {
  creatorId: string;
}

export default function ContentGrid({ creatorId }: ContentGridProps) {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [creatorId]);

  const fetchContent = async () => {
    try {
      const response = await api.get(`/content/creator/${creatorId}`);
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getContentIcon = (type: Content['type']) => {
    switch (type) {
      case 'image':
        return <FiImage className="w-4 h-4 text-white" />;
      case 'video':
        return <FiVideo className="w-4 h-4 text-white" />;
      case 'audio':
        return <FiMusic className="w-4 h-4 text-white" />;
      case 'live':
        return <FiPlay className="w-4 h-4 text-white" />;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
      {content.map((item) => (
        <div
          key={item.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
        >
          <div className="relative aspect-w-16 aspect-h-9">
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              className="object-cover"
            />
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2">
              {getContentIcon(item.type)}
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
} 