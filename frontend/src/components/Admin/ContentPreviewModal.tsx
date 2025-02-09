import { Content } from '@/types/content';

interface ContentPreviewModalProps {
  content: Content;
  onClose: () => void;
}

export default function ContentPreviewModal({ content, onClose }: ContentPreviewModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{content.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {content.description && (
            <p className="text-gray-600">{content.description}</p>
          )}

          <div className="border rounded p-4">
            {content.type === 'image' && (
              <img src={content.url} alt={content.title} className="max-w-full h-auto" />
            )}
            {content.type === 'video' && (
              <video src={content.url} controls className="max-w-full" />
            )}
            {content.type === 'audio' && (
              <audio src={content.url} controls className="w-full" />
            )}
            {content.type === 'text' && (
              <div className="prose max-w-none">
                {content.url}
              </div>
            )}
          </div>

          <div className="text-sm text-gray-500">
            <p>Criador: {content.creator?.name || 'Não informado'}</p>
            <p>Tipo: {content.type}</p>
            <p>Data: {new Date(content.createdAt).toLocaleDateString()}</p>
            <p>Visualização: {content.isPreview ? 'Pública' : 'Privada'}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 