import { useTheme } from '@/contexts/ThemeContext';
import { FiBell, FiMoon, FiSun, FiMenu } from 'react-icons/fi';

interface NavbarProps {
  onOpenSidebar?: () => void;
}

export default function Navbar({ onOpenSidebar }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

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
        </div>
      </div>
    </div>
  );
} 