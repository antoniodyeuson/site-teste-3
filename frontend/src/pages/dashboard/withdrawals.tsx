import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { api } from '@/services/api';
import { FiDollarSign, FiClock } from 'react-icons/fi';

interface WithdrawalStats {
  availableBalance: number;
  pendingBalance: number;
  totalWithdrawn: number;
}

interface WithdrawalHistory {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  paymentMethod: 'pix' | 'bank_transfer';
}

export default function WithdrawalsPage() {
  const [stats, setStats] = useState<WithdrawalStats | null>(null);
  const [history, setHistory] = useState<WithdrawalHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchWithdrawalData();
  }, []);

  const fetchWithdrawalData = async () => {
    try {
      const [statsResponse, historyResponse] = await Promise.all([
        api.get('/creators/withdrawals/stats'),
        api.get('/creators/withdrawals/history')
      ]);

      setStats(statsResponse.data);
      setHistory(historyResponse.data);
    } catch (error) {
      console.error('Erro ao buscar dados de saque:', error);
      setError('Erro ao buscar dados de saque');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/creators/withdrawals/request', {
        amount: Number(withdrawAmount)
      });

      setSuccess('Solicitação de saque enviada com sucesso!');
      setWithdrawAmount('');
      fetchWithdrawalData();
    } catch (error: any) {
      console.error('Erro ao solicitar saque:', error);
      setError(error.response?.data?.message || 'Erro ao solicitar saque');
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Saques</h1>
        </div>

        {/* Cards de Saldo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FiDollarSign className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Saldo Disponível
                </h3>
                <p className="text-2xl font-semibold text-green-600">
                  R$ {stats?.availableBalance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FiClock className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Saldo Pendente
                </h3>
                <p className="text-2xl font-semibold text-yellow-600">
                  R$ {stats?.pendingBalance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FiDollarSign className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Sacado
                </h3>
                <p className="text-2xl font-semibold text-blue-600">
                  R$ {stats?.totalWithdrawn.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de Saque */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Solicitar Saque</h2>

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

          <div className="flex space-x-4">
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Valor do saque"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
            <button
              onClick={handleWithdrawalRequest}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Solicitar Saque
            </button>
          </div>
        </div>

        {/* Histórico de Saques */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold">Histórico de Saques</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {history.map((withdrawal) => (
              <div key={withdrawal.id} className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      R$ {withdrawal.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(withdrawal.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        withdrawal.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : withdrawal.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {withdrawal.status === 'completed'
                        ? 'Concluído'
                        : withdrawal.status === 'pending'
                        ? 'Pendente'
                        : 'Falhou'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 