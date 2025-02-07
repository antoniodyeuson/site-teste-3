import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/Admin/AdminLayout';
import UserManagement from '@/components/Admin/UserManagement';
import ContentModeration from '@/components/Admin/ContentModeration';
import FinancialReports from '@/components/Admin/FinancialReports';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  if (user?.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="border-b dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'content'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Content Moderation
            </button>
            <button
              onClick={() => setActiveTab('financial')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'financial'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Financial Reports
            </button>
          </nav>
        </div>

        <div>
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'content' && <ContentModeration />}
          {activeTab === 'financial' && <FinancialReports />}
        </div>
      </div>
    </AdminLayout>
  );
} 