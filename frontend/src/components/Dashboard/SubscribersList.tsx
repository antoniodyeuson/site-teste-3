import { FiMail } from 'react-icons/fi';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  subscriptionDate: string;
  profileImage?: string;
}

export default function SubscribersList({ subscribers }: { subscribers: Subscriber[] }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Inscritos Recentes</h2>
        <div className="space-y-4">
          {subscribers.map((subscriber) => (
            <div
              key={subscriber.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <img
                  src={subscriber.profileImage || '/default-avatar.png'}
                  alt={subscriber.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {subscriber.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Inscrito em {new Date(subscriber.subscriptionDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <button
                className="ml-4 text-gray-400 hover:text-gray-500"
                title="Enviar mensagem"
              >
                <FiMail className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 