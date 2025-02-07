import { FiEdit2, FiTrash2 } from 'react-icons/fi';

interface Content {
  id: string;
  title: string;
  type: 'image' | 'video' | 'text';
  preview: string;
  views: number;
  likes: number;
  createdAt: string;
}

interface ContentListProps {
  contents: Content[];
  onEdit: (content: Content) => void;
  onDelete: (contentId: string) => void;
}

export default function ContentList({ contents, onEdit, onDelete }: ContentListProps) {
  if (!contents.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        Nenhum conteúdo publicado ainda
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Conteúdos Publicados
      </h2>
      <div className="space-y-4">
        {contents.map((content) => (
          <div
            key={content.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
          >
            <div className="flex items-center space-x-4">
              <img
                src={content.preview}
                alt={content.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {content.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(content.createdAt).toLocaleDateString('pt-BR')} •{' '}
                  {content.views} visualizações • {content.likes} curtidas
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(content)}
                className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiEdit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(content.id)}
                className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 