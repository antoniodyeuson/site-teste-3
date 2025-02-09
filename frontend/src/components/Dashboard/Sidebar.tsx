import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import {
  FiHome,
  FiFileText,
  FiUsers,
  FiDollarSign,
  FiSettings,
  FiX,
  FiLogOut,
  FiUser,
  FiCreditCard
} from 'react-icons/fi';
import { User } from '@/types';

interface SidebarProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome },
  { name: 'Conteúdo', href: '/dashboard/content', icon: FiFileText },
  { name: 'Inscritos', href: '/dashboard/subscribers', icon: FiUsers },
  { name: 'Finanças', href: '/dashboard/finances', icon: FiDollarSign },
  { name: 'Perfil', href: '/dashboard/profile', icon: FiUser },
  { name: 'Saques', href: '/dashboard/withdrawals', icon: FiCreditCard },
];

export default function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
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
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-primary text-white transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <Link href="/dashboard" className="text-xl font-bold">
              CreatorHub
            </Link>
            <button
              onClick={onClose}
              className="md:hidden p-2 hover:bg-primary-dark rounded-lg"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-primary-dark">
            <div className="flex items-center space-x-3">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-dark flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm opacity-75">Criador</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-primary-dark text-white'
                      : 'text-white/90 hover:bg-primary-dark'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-primary-dark">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-white/90 rounded-xl hover:bg-primary-dark transition-colors"
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