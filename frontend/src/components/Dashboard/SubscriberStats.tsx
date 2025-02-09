import { FiUsers, FiUserPlus, FiUserMinus, FiDollarSign } from 'react-icons/fi';

interface Stats {
  totalSubscribers: number;
  newSubscribers: number;
  churnRate: number;
  averageRevenue: number;
}

interface SubscriberStatsProps {
  stats: Stats;
}

export default function SubscriberStats({ stats }: SubscriberStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={<FiUsers />}
        title="Total de Inscritos"
        value={stats.totalSubscribers}
        textColor="text-blue-600"
        bgColor="bg-blue-100"
      />
      <StatCard
        icon={<FiUserPlus />}
        title="Novos Inscritos"
        value={stats.newSubscribers}
        textColor="text-green-600"
        bgColor="bg-green-100"
      />
      <StatCard
        icon={<FiUserMinus />}
        title="Taxa de Cancelamento"
        value={`${stats.churnRate}%`}
        textColor="text-red-600"
        bgColor="bg-red-100"
      />
      <StatCard
        icon={<FiDollarSign />}
        title="Receita Média/Inscrito"
        value={`R$ ${stats.averageRevenue.toFixed(2)}`}
        textColor="text-purple-600"
        bgColor="bg-purple-100"
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
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