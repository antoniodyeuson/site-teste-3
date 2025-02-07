import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut,
  FiBell,
  FiFileText,
  FiMoon,
  FiSun
} from 'react-icons/fi';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar com gradiente */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-primary to-secondary transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <div className="flex flex-col h-full text-white">
          <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
            <Link href="/dashboard" className="text-xl font-bold">
              CreatorHub
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
                  className={`flex items-center px-4 py-3 rounded-xl ${
                    isActive
                      ? 'bg-white text-primary'
                      : 'text-white/90 hover:bg-white/10'
                  } transition-colors`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-white/90 rounded-xl hover:bg-white/10 transition-colors"
            >
              <FiLogOut className="w-5 h-5 mr-3" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-64">
        {/* Top Bar com vidro */}
        <div className="sticky top-0 z-20 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              className="p-1 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <FiBell className="w-6 h-6" />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === 'light' ? (
                  <FiMoon className="w-6 h-6" />
                ) : (
                  <FiSun className="w-6 h-6" />
                )}
              </button>
            </div>
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