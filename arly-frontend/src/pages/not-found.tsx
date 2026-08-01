import { useNavigate, Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { ArrowLeft, Compass, Search } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto pt-16 sm:pt-24 px-4 text-center">
        <div className="inline-flex items-center justify-center gap-1.5 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 text-white font-black text-lg shadow-lg">
            A
          </div>
          <span className="text-sm font-bold tracking-tight text-gray-900 dark:text-white">
            ARLY
          </span>
        </div>

        <h1
          className="text-7xl sm:text-8xl font-black text-[#16181F] dark:text-white tracking-tight mb-3"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          404
          <span className="text-[#D98E1B]">.</span>
        </h1>

        <p className="text-lg font-semibold text-[#16181F] dark:text-white/90 mb-2">
          This page wandered off the price comparison
        </p>
        <p className="text-sm text-[#5B6270] dark:text-white/50 mb-8 max-w-md mx-auto">
          The link may be broken, or the page may have been moved. Check the URL or head back to start comparing prices.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 rounded-xl bg-[#16181F] px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#21365E] transition-all"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
          <Link
            to="/about"
            className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 px-6 py-3.5 text-sm font-semibold text-gray-700 dark:text-white/80 hover:bg-white/50 dark:hover:bg-white/5 transition-all"
          >
            <Compass size={16} />
            About ARLY
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-white/30">
          <Search size={12} />
          Tip: paste a product URL on the home page to start a comparison
        </div>
      </div>
    </PageTransition>
  );
}
