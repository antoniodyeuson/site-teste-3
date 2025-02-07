import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import api from '@/services/api';

interface SubscribeButtonProps {
  creatorId: string;
  price: number;
  isSubscribed: boolean;
}

export default function SubscribeButton({ creatorId, price, isSubscribed }: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      if (isSubscribed) {
        await api.post(`/subscriber/unsubscribe/${creatorId}`);
      } else {
        await api.post(`/subscriber/subscribe/${creatorId}`);
      }
      window.location.reload(); // Recarrega para atualizar o estado
    } catch (error) {
      console.error('Erro ao processar assinatura:', error);
      alert('Erro ao processar sua assinatura. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <button
        onClick={() => router.push('/login')}
        className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
      >
        Entrar para assinar
      </button>
    );
  }

  if (user.role === 'creator') {
    return null;
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className={`px-6 py-2 rounded-full transition-colors ${
        isSubscribed
          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
          : 'bg-primary text-white hover:bg-primary-dark'
      } disabled:opacity-50`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
      ) : isSubscribed ? (
        'Inscrito'
      ) : (
        `Assinar por R$${price.toFixed(2)}/mês`
      )}
    </button>
  );
} 