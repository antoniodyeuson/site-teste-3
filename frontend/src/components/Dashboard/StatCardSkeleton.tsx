export default function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="ml-4 flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
        </div>
      </div>
    </div>
  );
} 