import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const AddInvestment = () => {
  const getAuthHeader = useAuthStore((state) => state.getAuthHeader);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    stockName: '',
    ticker: '',
    quantity: '',
    buyPrice: '',
    purchaseDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/api/holdings', {
        stockName: form.stockName,
        ticker: form.ticker,
        quantity: parseInt(form.quantity),
        buyPrice: parseFloat(form.buyPrice),
        currentPrice: parseFloat(form.buyPrice),
        purchaseDate: form.purchaseDate || undefined,
      }, {
        headers: getAuthHeader(),
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add investment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-white flex flex-col items-center p-6 md:p-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Add Investment</h1>

      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock Name</label>
            <input
              id="stock-name"
              type="text"
              name="stockName"
              placeholder="Enter stock name"
              value={form.stockName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ticker</label>
            <input
              id="ticker"
              type="text"
              name="ticker"
              placeholder="e.g. AAPL"
              value={form.ticker}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all uppercase"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quantity</label>
            <input
              id="quantity"
              type="number"
              name="quantity"
              placeholder="Enter quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Buy Price</label>
            <input
              id="buy-price"
              type="number"
              name="buyPrice"
              placeholder="$0.00"
              value={form.buyPrice}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Purchase Date</label>
            <input
              id="purchase-date"
              type="date"
              name="purchaseDate"
              value={form.purchaseDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
        </form>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="px-8 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-8 py-3 bg-cta text-white font-medium rounded-lg hover:bg-cta-dark transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
        >
          {loading ? 'Adding...' : 'Add Investment'}
        </button>
      </div>
    </div>
  );
};

export default AddInvestment;
