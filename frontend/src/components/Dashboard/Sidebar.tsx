import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiSettings,
  FiX,
  FiLogOut,
  FiFileText
} from 'react-icons/fi';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
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
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-primary to-secondary transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="flex flex-col h-full text-white">
          <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
            <Link href="/dashboard" className="text-xl font-bold">
              CreatorHub
            </Link>
            <button
              className="md:hidden"
              onClick={onClose}
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
    </>
  );
} 