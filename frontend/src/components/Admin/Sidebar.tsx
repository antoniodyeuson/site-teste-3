'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FiHome, FiUsers, FiFileText, FiSettings, FiLogOut } from 'react-icons/fi';

const menuItems = [
  {
    href: '/admin/dashboard',
    title: 'Dashboard',
    icon: FiHome
  },
  {
    href: '/admin/users',
    title: 'Usuários',
    icon: FiUsers
  },
  {
    href: '/admin/content',
    title: 'Conteúdo',
    icon: FiFileText
  },
  {
    href: '/admin/settings',
    title: 'Configurações',
    icon: FiSettings
  }
];

export default function Sidebar() {
  const [mounted, setMounted] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const { logout } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    setMounted(true);
    setCurrentPath(window.location.pathname);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!mounted) return null;

  return (
    <div className="w-64 min-h-screen bg-blue-600 text-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          CreatorHub
        </h1>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const isActive = currentPath === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 text-white hover:bg-blue-700 transition-colors ${
                isActive ? 'bg-blue-700' : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-64 p-6">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-6 py-3 text-white hover:bg-blue-700 transition-colors"
        >
          <FiLogOut className="w-5 h-5 mr-3" />
          Sair
        </button>
      </div>
    </div>
  );
} 