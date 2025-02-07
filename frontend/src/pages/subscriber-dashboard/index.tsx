import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import api from '@/services/api';
import SubscriberLayout from '@/components/Subscriber/SubscriberLayout';
import { FiHeart, FiBookmark, FiClock } from 'react-icons/fi';

interface SubscriberDashboardData {
  subscriptions: Array<{
    id: string;
    creator: {
      id: string;
      name: string;
      profileImage: string;
    };
    startDate: string;
  }>;
  recentContent: Array<{
    id: string;
    title: string;
    preview: string;
    creator: {
      name: string;
      profileImage: string;
    };
    createdAt: string;
  }>;
  savedContent: Array<{
    id: string;
    title: string;
    preview: string;
    creator: {
      name: string;
      profileImage: string;
    };
  }>;
}

export default function SubscriberDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<SubscriberDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'subscriber') {
      router.push('/login');
      return;
    }
    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/subscriber/dashboard');
      setData(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados do painel:', error);
    } finally {
      setLoading(false);
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

  if (!data) return null;

  return (
    <SubscriberLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8">Meu Feed</h1>

        {/* Minhas Assinaturas */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Minhas Assinaturas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="bg-white rounded-lg shadow p-4 flex items-center"
              >
                <img
                  src={sub.creator.profileImage}
                  alt={sub.creator.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h3 className="font-medium">{sub.creator.name}</h3>
                  <p className="text-sm text-gray-500">
                    Desde {new Date(sub.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Conteúdo Recente */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Conteúdo Recente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.recentContent.map((content) => (
              <div key={content.id} className="bg-white rounded-lg shadow overflow-hidden">
                <img
                  src={content.preview}
                  alt={content.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium mb-2">{content.title}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <img
                      src={content.creator.profileImage}
                      alt={content.creator.name}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span>{content.creator.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Conteúdo Salvo */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Conteúdo Salvo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.savedContent.map((content) => (
              <div key={content.id} className="bg-white rounded-lg shadow overflow-hidden">
                <img
                  src={content.preview}
                  alt={content.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium mb-2">{content.title}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <img
                      src={content.creator.profileImage}
                      alt={content.creator.name}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span>{content.creator.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SubscriberLayout>
  );
} 