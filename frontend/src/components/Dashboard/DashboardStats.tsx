import { FiUsers, FiDollarSign, FiEye, FiHeart } from 'react-icons/fi';

interface Stats {
  subscribers: number;
  earnings: number;
  views: number;
  likes: number;
}

export default function DashboardStats({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={<FiUsers className="w-8 h-8" />}
        title="Inscritos"
        value={stats.subscribers}
        textColor="text-blue-600"
        bgColor="bg-blue-100"
      />
      <StatCard
        icon={<FiDollarSign className="w-8 h-8" />}
        title="Ganhos"
        value={`$${stats.earnings}`}
        textColor="text-green-600"
        bgColor="bg-green-100"
      />
      <StatCard
        icon={<FiEye className="w-8 h-8" />}
        title="Visualizações"
        value={stats.views}
        textColor="text-purple-600"
        bgColor="bg-purple-100"
      />
      <StatCard
        icon={<FiHeart className="w-8 h-8" />}
        title="Likes"
        value={stats.likes}
        textColor="text-red-600"
        bgColor="bg-red-100"
      />
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  textColor: string;
  bgColor: string;
}

function StatCard({ icon, title, value, textColor, bgColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${bgColor} ${textColor}`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className={`text-2xl font-semibold ${textColor}`}>{value}</p>
        </div>
      </div>
    </div>
  );
} 