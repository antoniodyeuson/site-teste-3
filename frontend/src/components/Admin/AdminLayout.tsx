import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';  

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user } = useAuth();
  const router = useRouter();

  // Proteger rota - apenas admins podem acessar
  if (!user || user.role !== 'admin') {
    router.push('/login');
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            {title && (
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
                {title}
              </h1>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 