import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import Layout from '@/components/Layout/Layout';
import ContentGrid from '@/components/Creator/ContentGrid';
import SubscribeButton from '@/components/Creator/SubscribeButton';
import Image from 'next/image';
import { FiUsers, FiImage, FiUser } from 'react-icons/fi';

interface CreatorProfile {
  id: string;
  name: string;
  bio: string;
  profileImage: string | null;
  coverImage?: string;
  subscriptionPrice: number;
  subscriberCount: number;
  contentCount: number;
}

export default function CreatorProfile() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!id) return;

      try {
        const [creatorRes, subsRes] = await Promise.all([
          api.get(`/creator/${id}`),
          user ? api.get(`/subscriber/check-subscription/${id}`) : Promise.resolve({ data: { isSubscribed: false } })
        ]);

        setCreator(creatorRes.data);
        setIsSubscribed(subsRes.data.isSubscribed);
      } catch (error) {
        console.error('Erro ao buscar dados do criador:', error);
        setError('Erro ao carregar perfil do criador');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCreatorData();
    }
  }, [id, user]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error || !creator) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-600">{error || 'Criador não encontrado'}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cover Image */}
        <div className="relative h-64 rounded-xl overflow-hidden mb-8">
          {creator.coverImage ? (
            <Image
              src={creator.coverImage}
              alt={`Capa de ${creator.name}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary to-secondary" />
          )}
        </div>

        {/* Profile Info */}
        <div className="relative -mt-24 sm:-mt-32 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 px-4">
            {/* Profile Image */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800">
              {creator.profileImage ? (
                <Image
                  src={creator.profileImage}
                  alt={creator.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiUser className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Creator Info */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {creator.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {creator.bio}
              </p>
              
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FiUsers className="w-5 h-5 mr-2" />
                  <span>{creator.subscriberCount} inscritos</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FiImage className="w-5 h-5 mr-2" />
                  <span>{creator.contentCount} conteúdos</span>
                </div>
              </div>
            </div>

            {/* Subscribe Button */}
            <div className="sm:ml-auto">
              <SubscribeButton
                creatorId={creator.id}
                price={creator.subscriptionPrice}
                isSubscribed={isSubscribed}
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        {isSubscribed ? (
          <ContentGrid creatorId={creator.id} />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Assine para ver o conteúdo
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Assine por R${creator.subscriptionPrice.toFixed(2)}/mês para acessar conteúdo exclusivo
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
} 