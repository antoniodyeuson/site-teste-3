import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  subscriptionDate: string;
  profileImage?: string;
}

interface SubscribersListProps {
  subscribers: Subscriber[];
}

export default function SubscribersList({ subscribers = [] }: SubscribersListProps) {
  if (!subscribers.length) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Inscritos Recentes
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Nenhum inscrito ainda
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Inscritos Recentes
      </h2>
      <div className="space-y-4">
        {subscribers.map((subscriber) => (
          <div
            key={subscriber.id}
            className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <img
              src={subscriber.profileImage || '/default-avatar.png'}
              alt={subscriber.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {subscriber.name}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {subscriber.email}
              </p>
              <p className="text-xs text-gray-400">
                Inscrito em {new Date(subscriber.subscriptionDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 