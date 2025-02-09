import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { Content } from '@/types';

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contents.map((content) => (
        <div
          key={content.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="relative aspect-w-16 aspect-h-9">
            <img
              src={content.preview}
              alt={content.title}
              className="object-cover"
            />
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={() => onEdit(content)}
                className="p-2 bg-black/50 rounded-full text-white hover:bg-black/75"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(content.id)}
                className="p-2 bg-black/50 rounded-full text-white hover:bg-black/75"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{content.title}</h3>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <FiEye className="w-4 h-4 mr-1" />
                {content.views} visualizações
              </div>
              <span>{new Date(content.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 