import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FiMenu, FiX, FiUser, FiLogIn, FiCompass, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '@/contexts/ThemeContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">NomeDoSite</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900"
              >
                Início
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900"
              >
                <FiCompass className="mr-1" />
                Explorar
              </Link>
            </div>
          </div>

          {/* Desktop Right buttons */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
              >
                {theme === 'light' ? (
                  <FiMoon className="w-5 h-5" />
                ) : (
                  <FiSun className="w-5 h-5" />
                )}
              </button>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
                  >
                    <FiUser className="mr-2" />
                    Meu Painel
                  </Link>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="inline-flex items-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                  >
                    <FiLogIn className="mr-2" />
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
                  >
                    Criar Conta
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Início
            </Link>
            <Link
              href="/explore"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              <div className="flex items-center">
                <FiCompass className="mr-2" />
                Explorar
              </div>
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Meu Painel
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Criar Conta
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 