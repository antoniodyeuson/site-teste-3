import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '@/services/api';
import { FiUsers, FiStar, FiLock } from 'react-icons/fi';

interface Creator {
  id: string;
  name: string;
  profileImage?: string;
  coverImage?: string;
  bio?: string;
  price: number;
  subscriberCount: number;
  previewContent?: {
    title: string;
    thumbnail: string;
  }[];
}

export default function Explore() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await api.get('/creators/explore');
        setCreators(response.data);
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Explore Criadores</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creators.map((creator) => (
          <Link href={`/creator/${creator.id}`} key={creator.id}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Cover Image */}
              <div className="relative h-48">
                {creator.coverImage ? (
                  <img
                    src={creator.coverImage}
                    alt={`Capa de ${creator.name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-primary to-secondary" />
                )}
              </div>

              {/* Profile Info */}
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    {creator.profileImage ? (
                      <img
                        src={creator.profileImage}
                        alt={creator.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{creator.name}</h2>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <FiUsers className="w-4 h-4 mr-1" />
                      <span>{creator.subscriberCount} inscritos</span>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-gray-600 dark:text-gray-400 line-clamp-2">
                  {creator.bio || 'Nenhuma biografia disponível'}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-primary font-semibold">
                    R$ {creator.price.toFixed(2)}/mês
                  </span>
                  <div className="flex items-center text-yellow-500">
                    <FiStar className="w-5 h-5 mr-1" />
                    <span>4.5</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 