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
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center text-white relative">
          {/* Botão de tema no canto superior direito da hero section */}
          <button
            onClick={toggleTheme}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
          >
            {theme === 'light' ? (
              <FiMoon className="w-6 h-6 text-white" />
            ) : (
              <FiSun className="w-6 h-6 text-white" />
            )}
          </button>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Descubra Conteúdo Exclusivo
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Conecte-se com criadores incríveis e acesse conteúdo único
          </p>
          <div className="space-x-4">
            <Link
              href="/explore"
              className="inline-flex items-center px-8 py-3 border-2 border-white rounded-full text-lg font-medium text-white hover:bg-white hover:text-primary transition-colors"
            >
              <FiCompass className="mr-2" />
              Explorar Agora
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-3 bg-white rounded-full text-lg font-medium text-primary hover:bg-gray-100 transition-colors"
            >
              Começar
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Por que nos escolher?</h2>
            <p className="text-gray-600 dark:text-gray-300">Tudo que você precisa para ter sucesso</p>
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

      {/* Featured Creators Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Criadores em Destaque
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Conheça alguns dos nossos criadores mais populares
          </p>
        </div>
        
        {/* Adicione aqui a lista de criadores em destaque */}
        
        <div className="text-center mt-12">
          <Link
            href="/explore"
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark"
          >
            Ver Todos os Criadores
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Pronto para Começar?
          </h2>
          <Link
            href="/register"
            className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
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
    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg text-center">
      <div className="text-primary mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
} 