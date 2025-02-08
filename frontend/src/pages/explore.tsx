import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '@/services/api';
import { FiUsers, FiStar } from 'react-icons/fi';

interface Creator {
  _id: string;
  name: string;
  profileImage?: string;
  coverImage?: string;
  bio?: string;
  price: number;
  subscriberCount: number;
  previewContent?: {
    title: string;
    preview: string;
  }[];
}

export default function Explore() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setLoading(true);
        const response = await api.get('/creators/explore');
        setCreators(response.data);
        setError('');
      } catch (error) {
        console.error('Erro ao buscar criadores:', error);
        setError('Erro ao carregar criadores');
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          {/* Esqueleto de carregamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Explorar Criadores</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creators.map((creator) => (
          <Link 
            key={creator._id} 
            href={`/creator/${creator._id}`}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Card do criador */}
            <div className="relative h-32">
              <img
                src={creator.coverImage || '/default-cover.jpg'}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            
            <div className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={creator.profileImage || '/default-avatar.jpg'}
                  alt={creator.name}
                  className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800"
                />
                <div>
                  <h2 className="font-semibold text-lg">{creator.name}</h2>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <FiUsers className="w-4 h-4 mr-1" />
                    <span>{creator.subscriberCount} inscritos</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                {creator.bio || 'Nenhuma biografia disponível'}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="font-semibold text-primary">
                  R$ {creator.price.toFixed(2)}/mês
                </span>
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                  Ver perfil
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 