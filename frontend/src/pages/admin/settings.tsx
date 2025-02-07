import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/Admin/AdminLayout';
import api from '@/services/api';
import { FiLock, FiMail, FiSave } from 'react-icons/fi';

export default function AdminSettings() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newEmail: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validações
    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      setMessage({ type: 'error', text: 'As novas senhas não coincidem' });
      return;
    }

    if (!formData.currentPassword) {
      setMessage({ type: 'error', text: 'Senha atual é obrigatória' });
      return;
    }

    if (!formData.newEmail && !formData.newPassword) {
      setMessage({ type: 'error', text: 'Forneça um novo email ou senha para atualizar' });
      return;
    }

    setLoading(true);

    try {
      const dataToUpdate = {
        currentPassword: formData.currentPassword,
        ...(formData.newEmail && { newEmail: formData.newEmail }),
        ...(formData.newPassword && { newPassword: formData.newPassword })
      };

      await api.patch('/api/admin/credentials', dataToUpdate);
      
      setMessage({ type: 'success', text: 'Credenciais atualizadas com sucesso' });
      setFormData({
        currentPassword: '',
        newEmail: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Erro ao atualizar credenciais'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-8">Configurações do Administrador</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {message.text && (
            <div className={`p-4 rounded-md ${
              message.type === 'error' 
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Senha Atual */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha Atual
            </label>
            <div className="relative">
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="input-field pl-10"
                required
              />
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Novo Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Novo Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="newEmail"
                value={formData.newEmail}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder={user?.email}
              />
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Nova Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nova Senha
            </label>
            <div className="relative">
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="input-field pl-10"
              />
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Confirmar Nova Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Nova Senha
            </label>
            <div className="relative">
              <input
                type="password"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                className="input-field pl-10"
              />
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Botão Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <FiSave className="mr-2" />
                Salvar Alterações
              </>
            )}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
} 