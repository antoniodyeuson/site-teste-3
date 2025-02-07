import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiUsers, FiFileText, FiSettings } from 'react-icons/fi';

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
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-gray-800 w-64 min-h-screen shadow-lg">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Admin Panel
        </h1>
      </div>

      <nav className="mt-4">
        {menuItems.map((item) => {
          const isActive = router.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                isActive ? 'bg-gray-100 dark:bg-gray-700 border-l-4 border-primary' : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 