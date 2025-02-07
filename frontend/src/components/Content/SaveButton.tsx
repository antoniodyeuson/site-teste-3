import { useState } from 'react';
import { FiBookmark } from 'react-icons/fi';
import api from '@/services/api';

interface SaveButtonProps {
  contentId: string;
  isSaved: boolean;
  onSave?: () => void;
  onUnsave?: () => void;
}

export default function SaveButton({ contentId, isSaved, onSave, onUnsave }: SaveButtonProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(isSaved);

  const handleClick = async () => {
    if (saving) return;

    setSaving(true);
    try {
      if (saved) {
        await api.delete(`/api/subscriber/content/save/${contentId}`);
        setSaved(false);
        onUnsave?.();
      } else {
        await api.post(`/api/subscriber/content/save/${contentId}`);
        setSaved(true);
        onSave?.();
      }
    } catch (error) {
      console.error('Erro ao alternar salvamento:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={saving}
      className={`p-2 rounded-full transition-colors ${
        saved
          ? 'text-primary bg-primary-light'
          : 'text-gray-500 hover:bg-gray-100'
      }`}
      title={saved ? 'Remover dos salvos' : 'Salvar conteúdo'}
    >
      <FiBookmark className={`w-5 h-5 ${saving ? 'animate-pulse' : ''}`} />
    </button>
  );
} 