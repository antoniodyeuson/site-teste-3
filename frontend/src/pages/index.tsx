import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import { FiDollarSign, FiUsers, FiLock, FiTrendingUp, FiSun, FiMoon } from 'react-icons/fi';
import { api } from '@/services/api';
import { useState } from 'react';

export default function Home() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');

  const checkUser = async () => {
    try {
      console.log('Verificando dados do dashboard');
      const response = await api.get('/creators/dashboard');
      setDashboardData(response.data);
    } catch (error: any) {
      console.error('Erro ao buscar dados do dashboard:', error);
      if (error.response?.status === 404) {
        setError('Rota do dashboard não encontrada');
      } else if (error.response?.status === 403) {
        setError('Acesso não autorizado');
      } else {
        setError('Erro ao carregar dados do dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            CreatorHub
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href={user.role === 'creator' ? '/dashboard' : '/subscriber-dashboard'}
                  className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary"
                >
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary"
                >
                  Configurações
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark"
                >
                  Criar conta
                </Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary rounded-lg"
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-90" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Compartilhe seu conteúdo exclusivo
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Conecte-se com sua audiência e monetize seu conteúdo de forma simples e segura
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!user && (
                <>
                  <Link
                    href="/register"
                    className="w-full sm:w-auto px-8 py-3 bg-white text-primary font-medium rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Começar agora
                  </Link>
                  <Link
                    href="/explore"
                    className="w-full sm:w-auto px-8 py-3 border-2 border-white text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
                  >
                    Explorar criadores
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Por que escolher nossa plataforma?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Tudo que você precisa para crescer como criador de conteúdo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<FiDollarSign />}
              title="Monetização Flexível"
              description="Defina seus preços e receba pagamentos de forma segura"
            />
            <FeatureCard
              icon={<FiUsers />}
              title="Comunidade Engajada"
              description="Conecte-se diretamente com seus fãs mais dedicados"
            />
            <FeatureCard
              icon={<FiLock />}
              title="Conteúdo Protegido"
              description="Seu conteúdo seguro e acessível apenas para assinantes"
            />
            <FeatureCard
              icon={<FiTrendingUp />}
              title="Crescimento Real"
              description="Ferramentas e insights para expandir sua audiência"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto para começar sua jornada?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de criadores que já estão monetizando seu conteúdo
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-3 bg-white text-primary font-medium rounded-xl hover:bg-gray-100 transition-colors"
            >
              Criar minha conta
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                CreatorHub
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                A plataforma ideal para criadores de conteúdo
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Plataforma
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                    Sobre nós
                  </Link>
                </li>
                <li>
                  <Link href="/explore" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                    Explorar
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Suporte
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                    Termos de Uso
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} CreatorHub. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="text-primary w-12 h-12 flex items-center justify-center bg-primary/10 rounded-lg mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
} 