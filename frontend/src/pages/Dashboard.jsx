import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import useAuthStore from '../store/authStore';

// Placeholder performance data
const performanceData = [
  { month: 'Jan', value: 20000 },
  { month: 'Feb', value: 28000 },
  { month: 'Mar', value: 25000 },
  { month: 'Apr', value: 23000 },
  { month: 'May', value: 27000 },
  { month: 'Jun', value: 24000 },
  { month: 'Jul', value: 22000 },
];

const Dashboard = () => {
  const getAuthHeader = useAuthStore((state) => state.getAuthHeader);
  const [summary, setSummary] = useState({
    totalValue: 0,
    totalPnL: 0,
    dailyChangePercent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axios.get('/api/holdings/summary', {
        headers: getAuthHeader(),
      });
      setSummary(res.data.summary);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const summaryCards = [
    {
      label: 'Total Value',
      value: formatCurrency(summary.totalValue),
      color: 'text-gray-900',
    },
    {
      label: 'Profit / Loss',
      value: `${summary.totalPnL >= 0 ? '+' : ''}${formatCurrency(summary.totalPnL)}`,
      color: summary.totalPnL >= 0 ? 'text-success' : 'text-danger',
    },
    {
      label: "Today's Change",
      value: `${summary.dailyChangePercent >= 0 ? '+' : ''}${summary.dailyChangePercent}%`,
      color: summary.dailyChangePercent >= 0 ? 'text-success' : 'text-danger',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-60px)] bg-white p-6 md:p-10">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {summaryCards.map((card, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-gray-500 mb-2">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>
              {loading ? '...' : card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Portfolio Performance Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Portfolio Performance</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={13} />
              <YAxis
                stroke="#9CA3AF"
                fontSize={13}
                tickFormatter={(val) => `$${val / 1000}k`}
              />
              <Tooltip
                formatter={(val) => [formatCurrency(val), 'Value']}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#5B2EFF"
                strokeWidth={2}
                dot={{ r: 4, fill: '#5B2EFF' }}
                activeDot={{ r: 6, fill: '#5B2EFF' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to="/dashboard"
          className="px-6 py-3 bg-cta text-white font-medium rounded-lg hover:bg-cta-dark transition-colors no-underline shadow-sm"
        >
          View Portfolio
        </Link>
        <Link
          to="/add-investment"
          className="px-6 py-3 bg-cta text-white font-medium rounded-lg hover:bg-cta-dark transition-colors no-underline shadow-sm"
        >
          Add Investment
        </Link>
        <Link
          to="/dashboard"
          className="px-6 py-3 bg-cta text-white font-medium rounded-lg hover:bg-cta-dark transition-colors no-underline shadow-sm"
        >
          Analysis
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
