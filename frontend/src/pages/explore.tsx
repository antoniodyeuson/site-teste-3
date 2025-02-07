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
  const router = useRouter();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      const response = await api.get('/creators/preview');
      setCreators(response.data);
    } catch (error) {
      console.error('Error fetching creators:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatorClick = (creatorId: string) => {
    router.push(`/login?redirect=/creator/${creatorId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Descubra Criadores Incríveis
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Explore conteúdo exclusivo dos melhores criadores
          </p>
          <div className="space-x-4">
            <Link
              href="/register"
              className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              Começar Agora
            </Link>
            <Link
              href="/login"
              className="border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Creators Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {creators.map((creator) => (
            <div
              key={creator.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200"
              onClick={() => handleCreatorClick(creator.id)}
            >
              {/* Cover/Preview Image */}
              <div className="relative h-48">
                <img
                  src={creator.coverImage || '/default-cover.jpg'}
                  alt={creator.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center">
                      <img
                        src={creator.profileImage || '/default-avatar.png'}
                        alt={creator.name}
                        className="w-12 h-12 rounded-full border-2 border-white"
                      />
                      <div className="ml-3 text-white">
                        <h3 className="font-semibold text-lg">{creator.name}</h3>
                        <div className="flex items-center text-sm">
                          <FiUsers className="mr-1" />
                          {creator.subscriberCount} inscritos
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Creator Info */}
              <div className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-2">{creator.bio}</p>
                
                {/* Preview Content */}
                {creator.previewContent && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Preview do Conteúdo</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {creator.previewContent.map((content, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={content.thumbnail}
                            alt={content.title}
                            className="w-full h-20 object-cover rounded"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <FiLock className="text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Tag */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-primary font-semibold">
                    ${creator.price}/mês
                  </div>
                  <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                    Ver Mais
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-gray-600 mb-8">
            Junte-se a nossa comunidade de criadores e assinantes
          </p>
          <Link
            href="/register"
            className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition"
          >
            Criar Conta
          </Link>
        </div>
      </div>
    </div>
  );
} 