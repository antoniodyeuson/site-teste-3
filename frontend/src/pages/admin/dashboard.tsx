import { useState, useEffect } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import StatCard from '@/components/Dashboard/StatCard';
import { FiUsers, FiDollarSign, FiFileText } from 'react-icons/fi';
import api from '@/services/api';

interface DashboardStats {
  totalUsers: number;
  totalCreators: number;
  totalSubscribers: number;
  totalContent: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCreators: 0,
    totalSubscribers: 0,
    totalContent: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total de Usuários"
          value={stats.totalUsers}
          icon={FiUsers}
          loading={loading}
        />
        <StatCard
          title="Criadores"
          value={stats.totalCreators}
          icon={FiUsers}
          loading={loading}
        />
        <StatCard
          title="Assinantes"
          value={stats.totalSubscribers}
          icon={FiUsers}
          loading={loading}
        />
        <StatCard
          title="Conteúdos"
          value={stats.totalContent}
          icon={FiFileText}
          loading={loading}
        />
        <StatCard
          title="Receita Total"
          value={`R$ ${stats.totalRevenue.toFixed(2)}`}
          icon={FiDollarSign}
          loading={loading}
        />
      </div>
    </AdminLayout>
  );
} 