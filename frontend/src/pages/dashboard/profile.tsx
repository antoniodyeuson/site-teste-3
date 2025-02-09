import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { FiUser, FiCamera, FiLock, FiCreditCard, FiBell } from 'react-icons/fi';
import { ProfileData, BankInfo, NotificationSettings } from '@/types/profile';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await api.get('/creator/profile');
      setProfileData(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados do perfil:', error);
      setError('Erro ao carregar dados do perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await api.patch('/creator/profile', {
        name: profileData?.name,
        cpf: profileData?.cpf,
        birthDate: profileData?.birthDate,
        phone: profileData?.phone
      });

      setProfileData(response.data);
      setSuccess('Dados pessoais atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar dados pessoais:', error);
      setError('Erro ao atualizar dados pessoais');
    }
  };

  const handleBankInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!profileData?.bankInfo) {
      setError('Dados bancários incompletos');
      return;
    }

    try {
      const response = await api.patch('/creator/bank-info', profileData.bankInfo);
      setProfileData(response.data);
      setSuccess('Dados bancários atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar dados bancários:', error);
      setError('Erro ao atualizar dados bancários');
    }
  };

  const handleNotificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!profileData?.notifications) {
      setError('Configurações de notificação incompletas');
      return;
    }

    try {
      const response = await api.patch('/creator/notifications', profileData.notifications);
      setProfileData(response.data);
      setSuccess('Preferências de notificação atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar notificações:', error);
      setError('Erro ao atualizar notificações');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const form = e.target as HTMLFormElement;
    const currentPassword = form.currentPassword.value;
    const newPassword = form.newPassword.value;
    const confirmPassword = form.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      await api.patch('/creators/password', {
        currentPassword,
        newPassword
      });
      
      setSuccess('Senha atualizada com sucesso!');
      form.reset();
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      setError('Erro ao atualizar senha');
    }
  };

  const handleProfileImageUpload = async (file: File) => {
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/creators/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setProfileData(prev => ({
        ...prev!,
        profileImage: response.data.profileImage
      }));
      
      setSuccess('Imagem de perfil atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar imagem:', error);
      setError('Erro ao atualizar imagem de perfil');
    }
  };

  const handleBankInfoChange = (field: keyof BankInfo, value: string) => {
    setProfileData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        bankInfo: {
          ...(prev.bankInfo || {}),
          [field]: value
        } as BankInfo
      };
    });
  };

  const handleNotificationChange = (field: keyof NotificationSettings, value: boolean) => {
    setProfileData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        notifications: {
          ...(prev.notifications || {}),
          [field]: value
        } as NotificationSettings
      };
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Erro</h2>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Perfil</h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('personal')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'personal'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dados Pessoais
            </button>
            <button
              onClick={() => setActiveTab('bank')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bank'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dados Bancários
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'security'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Segurança
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Notificações
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          {activeTab === 'personal' && (
            <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={profileData?.name || ''}
                  onChange={(e) =>
                    setProfileData(prev => ({ ...prev!, name: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  CPF
                </label>
                <input
                  type="text"
                  value={profileData?.cpf || ''}
                  onChange={(e) =>
                    setProfileData(prev => ({ ...prev!, cpf: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={profileData?.birthDate || ''}
                  onChange={(e) =>
                    setProfileData(prev => ({ ...prev!, birthDate: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={profileData?.phone || ''}
                  onChange={(e) =>
                    setProfileData(prev => ({ ...prev!, phone: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Salvar Alterações
              </button>
            </form>
          )}

          {activeTab === 'bank' && (
            <form onSubmit={handleBankInfoSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Banco
                </label>
                <input
                  type="text"
                  value={profileData?.bankInfo?.bankName || ''}
                  onChange={(e) => handleBankInfoChange('bankName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tipo de Conta
                </label>
                <select
                  value={profileData?.bankInfo?.accountType || ''}
                  onChange={(e) => handleBankInfoChange('accountType', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                >
                  <option value="corrente">Conta Corrente</option>
                  <option value="poupanca">Conta Poupança</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Agência
                </label>
                <input
                  type="text"
                  value={profileData?.bankInfo?.agency || ''}
                  onChange={(e) => handleBankInfoChange('agency', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Número da Conta
                </label>
                <input
                  type="text"
                  value={profileData?.bankInfo?.accountNumber || ''}
                  onChange={(e) => handleBankInfoChange('accountNumber', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Chave PIX
                </label>
                <input
                  type="text"
                  value={profileData?.bankInfo?.pixKey || ''}
                  onChange={(e) => handleBankInfoChange('pixKey', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Salvar Dados Bancários
              </button>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Senha Atual
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nova Senha
                </label>
                <input
                  type="password"
                  name="newPassword"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Alterar Senha
              </button>
            </form>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handleNotificationsSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Novos Inscritos
                    </h3>
                    <p className="text-sm text-gray-500">
                      Receba notificações quando alguém se inscrever no seu perfil
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData?.notifications?.newSubscriber || false}
                    onChange={(e) => handleNotificationChange('newSubscriber', e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Novas Mensagens
                    </h3>
                    <p className="text-sm text-gray-500">
                      Receba notificações quando receber uma nova mensagem
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData?.notifications?.newMessage || false}
                    onChange={(e) => handleNotificationChange('newMessage', e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Novas Compras
                    </h3>
                    <p className="text-sm text-gray-500">
                      Receba notificações quando alguém comprar seu conteúdo
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData?.notifications?.newPurchase || false}
                    onChange={(e) => handleNotificationChange('newPurchase', e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Novas Gorjetas
                    </h3>
                    <p className="text-sm text-gray-500">
                      Receba notificações quando receber uma gorjeta
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData?.notifications?.newTip || false}
                    onChange={(e) => handleNotificationChange('newTip', e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Salvar Preferências
              </button>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 