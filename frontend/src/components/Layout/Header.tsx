import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX, FiUser, FiBell } from 'react-icons/fi';

export default function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary">CreatorHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <>
                <Link href="/explore" className="px-3 py-2 rounded-md text-sm font-medium">
                  Explore
                </Link>
                {user.role === 'creator' && (
                  <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </Link>
                )}
                <div className="ml-3 relative">
                  <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                    <FiBell className="h-6 w-6" />
                  </button>
                </div>
                <div className="ml-3 relative">
                  <Link href="/profile" className="flex items-center">
                    {user.profileImage ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.profileImage}
                        alt={user.name}
                      />
                    ) : (
                      <FiUser className="h-6 w-6" />
                    )}
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="ml-3 px-4 py-2 rounded-md text-sm font-medium bg-primary text-white"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Link
                  href="/explore"
                  className="block px-3 py-2 rounded-md text-base font-medium"
                >
                  Explore
                </Link>
                {user.role === 'creator' && (
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 