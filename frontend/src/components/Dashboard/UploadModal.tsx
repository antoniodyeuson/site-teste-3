import { useState } from 'react';
import { FiX, FiUpload, FiDollarSign, FiLock } from 'react-icons/fi';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (formData: FormData) => Promise<void>;
}

export default function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('isPreview', String(isPreview));
      formData.append('file', file);
      if (previewFile) {
        formData.append('preview', previewFile);
      }

      await onUpload(formData);
      handleClose();
    } catch (error) {
      console.error('Erro no upload:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setIsPreview(false);
    setFile(null);
    setPreviewFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
        
        <div className="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Novo Conteúdo</h2>
            <button onClick={handleClose}>
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Preço (R$)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input-field"
                min="0"
                step="0.01"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPreview"
                checked={isPreview}
                onChange={(e) => setIsPreview(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="isPreview" className="text-sm">
                Conteúdo gratuito/preview
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Arquivo Principal</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="input-field"
                accept="image/*,video/*"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Preview (opcional)</label>
              <input
                type="file"
                onChange={(e) => setPreviewFile(e.target.files?.[0] || null)}
                className="input-field"
                accept="image/*"
              />
              <p className="text-xs text-gray-500 mt-1">
                Imagem de preview para conteúdo privado
              </p>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="btn-secondary"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 