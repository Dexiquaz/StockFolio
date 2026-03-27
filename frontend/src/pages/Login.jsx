import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Header Image — Stock chart gradient */}
          <div className="h-40 bg-linear-to-br from-gray-900 via-gray-800 to-primary relative overflow-hidden">
            <div className="absolute inset-0 flex items-end justify-center gap-1 pb-2 px-4">
              {[40, 65, 50, 80, 55, 90, 70, 95, 75, 85, 60, 100, 70, 80, 90].map((h, i) => (
                <div
                  key={i}
                  className="w-3 rounded-t-sm opacity-60"
                  style={{
                    height: `${h}%`,
                    background: `linear-gradient(to top, rgba(91, 46, 255, 0.3), rgba(91, 46, 255, 0.8))`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="p-8 pt-6">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">StockFolio</h2>
            <p className="text-sm text-gray-500 text-center mb-6">Log in to manage your portfolio</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9" />
                    </svg>
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </span>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    required
                  />
                </div>
                <div className="text-right mt-1">
                  <a href="#" className="text-xs text-primary hover:text-primary-dark transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-linear-to-r from-primary to-cta text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-md"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-medium hover:text-primary-dark transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer links */}
        <div className="flex justify-center gap-6 mt-6 text-xs text-gray-400">
          <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-600 transition-colors">Support</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
