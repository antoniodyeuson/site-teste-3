import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import StatCard from '@/components/Dashboard/StatCard';
import { api } from '@/services/api';
import { FiDollarSign, FiTrendingUp, FiUsers, FiCreditCard } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import { chartOptions } from '@/utils/chartConfig';

interface FinanceStats {
  totalEarnings: number;
  monthlyEarnings: number;
  pendingPayout: number;
  subscriberRevenue: number;
  contentSales: number;
  tipsReceived: number;
  subscribers: number;
  availableBalance: number;
}

interface EarningsHistory {
  date: string;
  amount: number;
}

export default function FinancesPage() {
  const [stats, setStats] = useState<FinanceStats | null>(null);
  const [earningsHistory, setEarningsHistory] = useState<EarningsHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'7days' | '30days' | '90days'>('30days');

  useEffect(() => {
    fetchFinanceData();
  }, [period]);

  const fetchFinanceData = async () => {
    try {
      const [statsResponse, historyResponse] = await Promise.all([
        api.get('/creators/finances/stats'),
        api.get(`/creators/finances/history?period=${period}`)
      ]);

      setStats(statsResponse.data);
      setEarningsHistory(historyResponse.data);
    } catch (error) {
      console.error('Erro ao buscar dados financeiros:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: earningsHistory.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Ganhos',
        data: earningsHistory.map(item => item.amount),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      }
    ]
  };

  if (loading || !stats) {
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
          <h1 className="text-2xl font-bold">Finanças</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setPeriod('7days')}
              className={`px-4 py-2 rounded-lg ${
                period === '7days' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              7 dias
            </button>
            <button
              onClick={() => setPeriod('30days')}
              className={`px-4 py-2 rounded-lg ${
                period === '30days' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              30 dias
            </button>
            <button
              onClick={() => setPeriod('90days')}
              className={`px-4 py-2 rounded-lg ${
                period === '90days' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              90 dias
            </button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<FiDollarSign size={20} />}
            title="Ganhos Totais"
            value={`R$ ${stats.totalEarnings.toFixed(2)}`}
            description="Total acumulado"
            color="blue"
          />
          <StatCard
            icon={<FiTrendingUp size={20} />}
            title="Ganhos do Mês"
            value={`R$ ${stats.monthlyEarnings.toFixed(2)}`}
            description="Mês atual"
            color="green"
          />
          <StatCard
            icon={<FiUsers size={20} />}
            title="Assinantes"
            value={stats.subscribers.toString()}
            description="Total de assinantes"
            color="yellow"
          />
          <StatCard
            icon={<FiCreditCard size={20} />}
            title="Saldo Disponível"
            value={`R$ ${stats.availableBalance.toFixed(2)}`}
            description="Disponível para saque"
            color="green"
          />
        </div>

        {/* Gráfico de Ganhos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Histórico de Ganhos</h2>
          <div className="h-80">
            <Line 
              data={chartData} 
              options={chartOptions}
              key={Math.random()}
            />
          </div>
        </div>

        {/* Detalhamento de Receitas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Detalhamento de Receitas</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <FiUsers className="w-5 h-5 mr-3 text-blue-500" />
                <span>Assinaturas</span>
              </div>
              <span className="font-semibold">R$ {stats.subscriberRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <FiDollarSign className="w-5 h-5 mr-3 text-green-500" />
                <span>Vendas de Conteúdo</span>
              </div>
              <span className="font-semibold">R$ {stats.contentSales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <FiCreditCard className="w-5 h-5 mr-3 text-purple-500" />
                <span>Gorjetas</span>
              </div>
              <span className="font-semibold">R$ {stats.tipsReceived.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 