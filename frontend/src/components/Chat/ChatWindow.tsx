import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
}

interface ChatWindowProps {
  receiverId: string;
  receiverName: string;
}

export default function ChatWindow({ receiverId, receiverName }: ChatWindowProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef<Socket>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to WebSocket server
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      query: { userId: user?.id }
    });

    // Load previous messages
    fetchMessages();

    // Listen for new messages
    socketRef.current.on('newMessage', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [receiverId]);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/messages/${receiverId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const message = {
        senderId: user!.id,
        receiverId,
        content: newMessage
      };

      const response = await api.post('/messages', message);
      socketRef.current?.emit('sendMessage', response.data);
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold">{receiverName}</h2>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === user?.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.senderId === user?.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              <p>{message.content}</p>
              <span className="text-xs opacity-70">
                {new Date(message.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 