import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import ContentGrid from '@/components/Creator/ContentGrid';
import SubscribeButton from '@/components/Creator/SubscribeButton';
import ChatButton from '@/components/Creator/ChatButton';

interface CreatorProfile {
  id: string;
  name: string;
  bio: string;
  profileImage: string;
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

  useEffect(() => {
    if (id) {
      fetchCreatorProfile();
      checkSubscriptionStatus();
    }
  }, [id]);

  const fetchCreatorProfile = async () => {
    try {
      const response = await api.get(`/creators/${id}`);
      setCreator(response.data);
    } catch (error) {
      console.error('Error fetching creator profile:', error);
    }
  };

  const checkSubscriptionStatus = async () => {
    if (!user) return;
    try {
      const response = await api.get(`/subscriptions/check/${id}`);
      setIsSubscribed(response.data.isSubscribed);
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  if (!creator) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-primary to-secondary">
          <img
            src={creator.profileImage}
            alt={creator.name}
            className="absolute bottom-0 left-8 transform translate-y-1/2 w-32 h-32 rounded-full border-4 border-white dark:border-gray-800"
          />
        </div>

        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{creator.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{creator.bio}</p>
            </div>
            <div className="flex space-x-4">
              {!isSubscribed && <SubscribeButton creatorId={creator.id} price={creator.subscriptionPrice} />}
              {isSubscribed && <ChatButton creatorId={creator.id} creatorName={creator.name} />}
            </div>
          </div>

          <div className="flex space-x-8 mt-8">
            <div>
              <span className="text-2xl font-bold">{creator.subscriberCount}</span>
              <span className="text-gray-600 dark:text-gray-400 ml-2">Subscribers</span>
            </div>
            <div>
              <span className="text-2xl font-bold">{creator.contentCount}</span>
              <span className="text-gray-600 dark:text-gray-400 ml-2">Posts</span>
            </div>
          </div>
        </div>
      </div>

      {isSubscribed ? (
        <ContentGrid creatorId={creator.id} />
      ) : (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Subscribe to see content</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Subscribe for ${creator.subscriptionPrice}/month to access exclusive content
          </p>
          <SubscribeButton creatorId={creator.id} price={creator.subscriptionPrice} />
        </div>
      )}
    </div>
  );
} 