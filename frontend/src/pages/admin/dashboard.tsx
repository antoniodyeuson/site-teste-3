import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/Admin/AdminLayout';
import { FiUsers, FiDollarSign, FiFileText, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';
import api from '@/services/api';

interface DashboardStats {
  totalUsers: number;
  revenue: number;
  totalContent: number;
  pendingReports: number;
  userGrowth: number;
  revenueGrowth: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!stats) return null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Painel Administrativo
          </h1>
          <div className="flex items-center space-x-4">
            <select className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <option value="7days">Últimos 7 dias</option>
              <option value="30days">Últimos 30 dias</option>
              <option value="90days">Últimos 90 dias</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<FiUsers className="w-8 h-8" />}
            title="Usuários"
            value={stats.totalUsers}
            trend={stats.userGrowth}
            description="Total de usuários"
            color="blue"
          />
          <StatCard
            icon={<FiDollarSign className="w-8 h-8" />}
            title="Receita"
            value={`R$ ${stats.revenue.toLocaleString()}`}
            trend={stats.revenueGrowth}
            description="Receita total"
            color="green"
          />
          <StatCard
            icon={<FiFileText className="w-8 h-8" />}
            title="Conteúdos"
            value={stats.totalContent}
            description="Total de conteúdos"
            color="purple"
          />
          <StatCard
            icon={<FiAlertCircle className="w-8 h-8" />}
            title="Denúncias"
            value={stats.pendingReports}
            description="Denúncias pendentes"
            color="red"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Crescimento de Usuários
              </h2>
              <FiTrendingUp className="w-6 h-6 text-blue-500" />
            </div>
            {/* Adicione aqui o componente de gráfico */}
            <div className="h-80 bg-gray-50 dark:bg-gray-700/50 rounded-xl"></div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Receita Mensal
              </h2>
              <FiDollarSign className="w-6 h-6 text-green-500" />
            </div>
            {/* Adicione aqui o componente de gráfico */}
            <div className="h-80 bg-gray-50 dark:bg-gray-700/50 rounded-xl"></div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Atividades Recentes
          </h2>
          <div className="space-y-4">
            {/* Adicione aqui a lista de atividades recentes */}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  description: string;
  trend?: number;
  color: 'blue' | 'green' | 'purple' | 'red';
}

const colorVariants = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  green: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
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