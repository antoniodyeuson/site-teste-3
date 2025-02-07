import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/Admin/AdminLayout';
import { FiUsers, FiDollarSign, FiFileText, FiAlertCircle } from 'react-icons/fi';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<FiUsers className="w-8 h-8" />}
            title="Usuários"
            value="0"
            description="Total de usuários"
          />
          <StatCard
            icon={<FiDollarSign className="w-8 h-8" />}
            title="Receita"
            value="$0"
            description="Receita total"
          />
          <StatCard
            icon={<FiFileText className="w-8 h-8" />}
            title="Conteúdos"
            value="0"
            description="Total de conteúdos"
          />
          <StatCard
            icon={<FiAlertCircle className="w-8 h-8" />}
            title="Denúncias"
            value="0"
            description="Denúncias pendentes"
          />
        </div>

        {/* Adicione mais seções conforme necessário */}
      </div>
    </AdminLayout>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}

function StatCard({ icon, title, value, description }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-primary bg-opacity-10 text-primary">
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold">{value}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
} 