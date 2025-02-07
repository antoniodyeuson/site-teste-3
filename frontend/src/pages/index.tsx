import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { FiDollarSign, FiUsers, FiLock, FiTrendingUp, FiCompass, FiSun, FiMoon } from 'react-icons/fi';
import Navbar from '@/components/Layout/Navbar';
import { useTheme } from '@/contexts/ThemeContext';

export default function Home() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      
      {/* Hero Section com gradiente */}
      <div className="bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center text-white relative">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-fade-in">
            Descubra Conteúdo Exclusivo
          </h1>
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto">
            Conecte-se com criadores incríveis e acesse conteúdo único
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/explore"
              className="inline-flex items-center px-8 py-4 border-2 border-white rounded-xl text-lg font-medium text-white hover:bg-white hover:text-primary transition-all transform hover:scale-105"
            >
              <FiCompass className="mr-2" />
              Explorar Agora
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-4 bg-white rounded-xl text-lg font-medium text-primary hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                Criar Conta
              </Link>
              <button
                onClick={toggleTheme}
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
              >
                {theme === 'light' ? (
                  <FiMoon className="w-6 h-6 text-white" />
                ) : (
                  <FiSun className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section com cards modernos */}
      <div className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Por que nos escolher?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Tudo que você precisa para ter sucesso
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<FiDollarSign className="h-8 w-8" />}
              title="Ganhos Flexíveis"
              description="Defina seus próprios preços de assinatura e ganhe com seu conteúdo"
            />
            <FeatureCard
              icon={<FiUsers className="h-8 w-8" />}
              title="Comunidade Crescente"
              description="Conecte-se com seu público através de mensagens diretas"
            />
            <FeatureCard
              icon={<FiLock className="h-8 w-8" />}
              title="Conteúdo Seguro"
              description="Seu conteúdo é protegido e acessível apenas para assinantes"
            />
            <FeatureCard
              icon={<FiTrendingUp className="h-8 w-8" />}
              title="Análises"
              description="Acompanhe seu crescimento com análises detalhadas"
            />
          </div>
        </div>
      </div>

      {/* CTA Section com gradiente */}
      <div className="bg-gradient-to-br from-primary to-secondary py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-8">
            Pronto para Começar?
          </h2>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-4 bg-white rounded-xl text-lg font-medium text-primary hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Criar sua Conta
          </Link>
        </div>
      </div>
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
    <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all">
      <div className="text-primary mb-6 bg-primary/10 p-4 rounded-xl inline-block">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-4 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
} 