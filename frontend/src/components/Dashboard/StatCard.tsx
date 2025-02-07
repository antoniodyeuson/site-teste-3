import { IconType } from 'react-icons';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: IconType;
  loading?: boolean;
}

export default function StatCard({ title, value, icon: Icon, loading }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-primary/10 text-primary">
          <Icon className="w-6 h-6" />
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ) : (
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
          )}
        </div>
      </div>
    </div>
  );
} 