import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Left: Logo */}
      <Link to={token ? '/dashboard' : '/'} className="flex items-center gap-2 no-underline">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-xl font-bold text-gray-900">StockFolio</span>
      </Link>

      {/* Center: Nav links (only when not logged in) */}
      {!token && (
        <div className="hidden md:flex items-center gap-8">
          <a href="#product" className="text-sm text-gray-600 hover:text-gray-900 no-underline transition-colors">Product</a>
          <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 no-underline transition-colors">Pricing</a>
          <a href="#company" className="text-sm text-gray-600 hover:text-gray-900 no-underline transition-colors">Company</a>
        </div>
      )}

      {/* Right: Auth buttons */}
      <div className="flex items-center gap-3">
        {token ? (
          <>
            <Link
              to="/dashboard"
              className={`text-sm no-underline transition-colors ${
                pathname === '/dashboard'
                  ? 'text-primary font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className={`text-sm no-underline transition-colors ${
                pathname === '/profile'
                  ? 'text-primary font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary-dark transition-colors cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`text-sm no-underline transition-colors ${
                pathname === '/login'
                  ? 'text-primary font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className={`px-4 py-2 text-sm font-medium rounded-full no-underline transition-colors ${
                pathname === '/signup'
                  ? 'bg-primary-dark text-white ring-2 ring-primary-light ring-offset-1'
                  : 'bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
