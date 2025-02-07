import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import api from '@/services/api';
import { FiHeart, FiBookmark, FiClock, FiTrendingUp, FiPlay } from 'react-icons/fi';
import SubscriberLayout from '@/components/Subscriber/SubscriberLayout';
import Link from 'next/link';
import StatCard from '@/components/Dashboard/StatCard';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';

interface DashboardData {
  stats: {
    totalSubscriptions: number;
    savedContent: number;
    watchedContent: number;
    totalInteractions: number;
  };
  subscriptions: Array<{
    id: string;
    creator: {
      id: string;
      name: string;
      profileImage?: string;
      description: string;
    };
    startDate: string;
  }>;
  recentContent: Array<{
    id: string;
    title: string;
    type: 'image' | 'video' | 'text';
    preview: string;
    creatorName: string;
    creatorImage?: string;
    createdAt: string;
  }>;
  savedContent: Array<{
    id: string;
    content: {
      id: string;
      title: string;
      type: 'image' | 'video' | 'text';
      preview: string;
    };
    creator: {
      name: string;
      profileImage?: string;
    };
    savedAt: string;
  }>;
}

interface SubscriberStats {
  totalSubscriptions: number;
  savedContent: number;
  watchedContent: number;
  totalInteractions: number;
}

export default function SubscriberDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<SubscriberStats | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      if (authLoading) return;
      
      if (user && user.role !== 'subscriber') {
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
        return;
      }

      try {
        const response = await api.get('/subscriber/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        setError('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [user, router, authLoading]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/subscriber/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      setError('Erro ao carregar estatísticas');
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

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-600 p-4">{error}</div>
      </DashboardLayout>
    );
  }

  if (!data || !stats) return null;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Meu Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Inscrições"
            value={stats.totalSubscriptions}
            icon={<FiBookmark className="w-6 h-6" />}
          />
          <StatCard
            title="Conteúdos Salvos"
            value={stats.savedContent}
            icon={<FiHeart className="w-6 h-6" />}
          />
          <StatCard
            title="Conteúdos Assistidos"
            value={stats.watchedContent}
            icon={<FiPlay className="w-6 h-6" />}
          />
          <StatCard
            title="Interações"
            value={stats.totalInteractions}
            icon={<FiHeart className="w-6 h-6" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Conteúdo Recente
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.recentContent.map((content) => (
                  <Link
                    key={content.id}
                    href={`/content/${content.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                      <img
                        src={content.preview}
                        alt={content.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform"
                      />
                      {content.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                          <FiPlay className="w-12 h-12 text-white" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {content.title}
                    </h3>
                    <div className="flex items-center mt-2">
                      <img
                        src={content.creatorImage || '/default-avatar.png'}
                        alt={content.creatorName}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span className="text-sm text-gray-500">
                        {content.creatorName}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscriptions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Minhas Assinaturas
              </h2>
              <div className="space-y-4">
                {data.subscriptions.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/creator/${sub.creator.id}`}
                    className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <img
                      src={sub.creator.profileImage || '/default-avatar.png'}
                      alt={sub.creator.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {sub.creator.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {sub.creator.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Saved Content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Salvos Recentemente
                </h2>
                <Link
                  href="/subscriber-dashboard/saved"
                  className="text-sm text-primary hover:text-primary-dark transition-colors"
                >
                  Ver todos
                </Link>
              </div>
              <div className="space-y-4">
                {data.savedContent.slice(0, 5).map((saved) => (
                  <Link
                    key={saved.id}
                    href={`/content/${saved.content.id}`}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="w-20 h-12 rounded-lg overflow-hidden">
                      <img
                        src={saved.content.preview}
                        alt={saved.content.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {saved.content.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {saved.creator.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 