import { useTheme } from '@/contexts/ThemeContext';
import { FiBell, FiMoon, FiSun, FiMenu, FiUser, FiX, FiHome, FiUsers, FiDollarSign, FiSettings, FiLogOut } from 'react-icons/fi';
import { User } from '@/types';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  user: User;
  onOpenSidebar?: () => void;
}

export default function Navbar({ user, onOpenSidebar }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Conteúdo', href: '/dashboard/content', icon: FiHome },
    { name: 'Inscritos', href: '/dashboard/subscribers', icon: FiUsers },
    { name: 'Finanças', href: '/dashboard/finances', icon: FiDollarSign },
    { name: 'Configurações', href: '/dashboard/settings', icon: FiSettings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="sticky top-0 z-20 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-16 px-4">
        <button
          className="p-1 md:hidden"
          onClick={onOpenSidebar}
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

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {user.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <FiUser className="w-8 h-8 p-1 rounded-full bg-gray-200 dark:bg-gray-700" />
              )}
              <span className="hidden md:block">{user.name}</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1">
                <Link
                  href="/dashboard/settings"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Configurações
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 