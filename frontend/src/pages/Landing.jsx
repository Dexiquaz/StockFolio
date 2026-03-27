import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Landing = () => {
  const token = useAuthStore((state) => state.token);

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4 tracking-tight">
          StockFolio
        </h1>
        <p className="text-gray-500 text-lg mb-8">
          Track, analyse and grow your investments
        </p>
        <Link
          to={token ? '/dashboard' : '/login'}
          className="inline-block px-8 py-3 bg-cta text-white font-medium rounded-lg hover:bg-cta-dark transition-colors no-underline shadow-md hover:shadow-lg"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Landing;
