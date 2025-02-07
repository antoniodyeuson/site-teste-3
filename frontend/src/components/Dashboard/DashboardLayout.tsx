import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut,
  FiBell,
  FiFileText
} from 'react-icons/fi';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', href: '/dashboard' },
    { icon: FiFileText, label: 'Conteúdos', href: '/dashboard/content' },
    { icon: FiUsers, label: 'Inscritos', href: '/dashboard/subscribers' },
    { icon: FiDollarSign, label: 'Finanças', href: '/dashboard/finances' },
    { icon: FiSettings, label: 'Configurações', href: '/dashboard/settings' }
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/dashboard" className="text-xl font-bold text-primary">
              Creator Dashboard
            </Link>
            <button
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100"
            >
              <FiLogOut className="w-5 h-5 mr-3" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 bg-white shadow-sm">
          <button
            className="p-1 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-4">
            <button className="p-1 text-gray-400 hover:text-gray-500">
              <FiBell className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 