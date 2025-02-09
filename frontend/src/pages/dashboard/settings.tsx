import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { FiSave, FiDollarSign, FiLock, FiCreditCard } from 'react-icons/fi';

interface CreatorSettings {
  subscriptionPrice: number;
  allowTips: boolean;
  minimumTipAmount: number;
  allowMessages: boolean;
  allowComments: boolean;
  notifyNewSubscribers: boolean;
  stripeConnected: boolean;
  payoutMethod: 'stripe' | 'bank';
  bankInfo?: {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
  };
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<CreatorSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/creators/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.patch('/creators/settings', settings);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    try {
      await api.patch('/auth/change-password', {
        currentPassword,
        newPassword
      });
      alert('Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      alert('Erro ao alterar senha');
    }
  };

  const connectStripe = async () => {
    try {
      const response = await api.post('/creators/stripe/connect');
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Erro ao conectar com Stripe:', error);
      alert('Erro ao conectar com Stripe');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div>Carregando...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Configurações</h1>

        {/* Configurações de Preço e Pagamentos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Preços e Pagamentos</h2>
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Preço da Assinatura (R$)
              </label>
              <input
                type="number"
                value={settings?.subscriptionPrice}
                onChange={(e) => setSettings({
                  ...settings!,
                  subscriptionPrice: parseFloat(e.target.value)
                })}
                className="input-field"
                min="0"
                step="0.01"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowTips"
                checked={settings?.allowTips}
                onChange={(e) => setSettings({
                  ...settings!,
                  allowTips: e.target.checked
                })}
                className="mr-2"
              />
              <label htmlFor="allowTips">Permitir Gorjetas</label>
            </div>

            {settings?.allowTips && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Valor Mínimo de Gorjeta (R$)
                </label>
                <input
                  type="number"
                  value={settings?.minimumTipAmount}
                  onChange={(e) => setSettings({
                    ...settings!,
                    minimumTipAmount: parseFloat(e.target.value)
                  })}
                  className="input-field"
                  min="0"
                  step="0.01"
                />
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </form>
        </div>

        {/* Configurações de Conta */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Configurações de Conta</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Senha Atual
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Nova Senha
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Alterar Senha
            </button>
          </form>
        </div>

        {/* Configurações do Stripe */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Pagamentos</h2>
          {settings?.stripeConnected ? (
            <div className="text-green-500 flex items-center">
              <FiCreditCard className="w-5 h-5 mr-2" />
              Conta Stripe conectada
            </div>
          ) : (
            <button
              onClick={connectStripe}
              className="btn-primary w-full"
            >
              Conectar com Stripe
            </button>
          )}
        </div>

        {/* Configurações de Notificações */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Notificações</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifyNewSubscribers"
                checked={settings?.notifyNewSubscribers}
                onChange={(e) => setSettings({
                  ...settings!,
                  notifyNewSubscribers: e.target.checked
                })}
                className="mr-2"
              />
              <label htmlFor="notifyNewSubscribers">
                Notificar novos inscritos
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowMessages"
                checked={settings?.allowMessages}
                onChange={(e) => setSettings({
                  ...settings!,
                  allowMessages: e.target.checked
                })}
                className="mr-2"
              />
              <label htmlFor="allowMessages">
                Permitir mensagens diretas
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowComments"
                checked={settings?.allowComments}
                onChange={(e) => setSettings({
                  ...settings!,
                  allowComments: e.target.checked
                })}
                className="mr-2"
              />
              <label htmlFor="allowComments">
                Permitir comentários
              </label>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 