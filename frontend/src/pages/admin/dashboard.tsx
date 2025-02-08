'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { FiUsers, FiDollarSign, FiFileText, FiUserCheck, FiActivity } from 'react-icons/fi';
import api from '@/services/api';

interface DashboardStats {
  totalUsers: number;
  totalCreators: number;
  totalSubscribers: number;
  totalContent: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCreators: 0,
    totalSubscribers: 0,
    totalContent: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'admin') {
      router.push('/');
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/dashboard-stats');
        setStats(response.data);
        setError('');
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        setError('Erro ao carregar estatísticas do dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, router]);

  if (!mounted) return null;

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">
          Dashboard do Administrador
        </h1>

        {error && (
          <div className="mb-6 bg-red-500/10 text-red-500 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="text-blue-500">
                <FiUsers className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-400 text-sm">Total de Usuários</h3>
                <p className="text-white text-2xl font-semibold">
                  {loading ? '...' : stats.totalUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="text-green-500">
                <FiUserCheck className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-400 text-sm">Criadores</h3>
                <p className="text-white text-2xl font-semibold">
                  {loading ? '...' : stats.totalCreators}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="text-purple-500">
                <FiUsers className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-400 text-sm">Assinantes</h3>
                <p className="text-white text-2xl font-semibold">
                  {loading ? '...' : stats.totalSubscribers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="text-yellow-500">
                <FiFileText className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-400 text-sm">Conteúdos</h3>
                <p className="text-white text-2xl font-semibold">
                  {loading ? '...' : stats.totalContent}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="text-pink-500">
                <FiDollarSign className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-400 text-sm">Receita Total</h3>
                <p className="text-white text-2xl font-semibold">
                  {loading ? '...' : `R$ ${stats.totalRevenue.toFixed(2)}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Aqui você pode adicionar mais seções como gráficos, tabelas, etc */}
      </div>
    </AdminLayout>
  );
} 