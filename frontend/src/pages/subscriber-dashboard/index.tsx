import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import api from '@/services/api';
import { FiHeart, FiBookmark, FiClock, FiTrendingUp, FiPlay } from 'react-icons/fi';
import SubscriberLayout from '@/components/Subscriber/SubscriberLayout';
import Link from 'next/link';
import StatCard from '@/components/Dashboard/StatCard';

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

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  description: string;
  trend?: number;
  color: 'blue' | 'green' | 'purple' | 'red' | 'pink';
}

const colorVariants = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  green: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
  pink: 'bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400'
};

function StatCard({ icon, title, value, description, trend, color }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform">
      <div className="flex items-center">
        <div className={`p-3 rounded-xl ${colorVariants[color]}`}>
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {value}
            </p>
            {trend !== undefined && (
              <span className={`ml-2 text-sm ${
                trend >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {trend >= 0 ? '+' : ''}{trend}%
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SubscriberDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
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
      const response = await api.get('/subscriber/dashboard');
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
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
        </div>
      </SubscriberLayout>
    );
  }

  if (!data) return null;

  return (
    <SubscriberLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Meu Feed
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<FiHeart className="w-8 h-8" />}
            title="Assinaturas"
            value={data.stats.totalSubscriptions}
            description="Canais assinados"
            color="pink"
          />
          <StatCard
            icon={<FiBookmark className="w-8 h-8" />}
            title="Salvos"
            value={data.stats.savedContent}
            description="Conteúdos salvos"
            color="blue"
          />
          <StatCard
            icon={<FiClock className="w-8 h-8" />}
            title="Assistidos"
            value={data.stats.watchedContent}
            description="Conteúdos assistidos"
            color="purple"
          />
          <StatCard
            icon={<FiTrendingUp className="w-8 h-8" />}
            title="Interações"
            value={data.stats.totalInteractions}
            description="Total de interações"
            color="green"
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
    </SubscriberLayout>
  );
} 