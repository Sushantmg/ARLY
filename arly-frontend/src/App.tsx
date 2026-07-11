import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import Result from './pages/result';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="border-b border-gray-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* 🏷️ Logo (Left Side) */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-base shadow-sm transition-transform group-hover:scale-105">
            A
          </div>
          <span className="font-extrabold text-xl tracking-tight text-gray-900">
            ARLY
          </span>
        </Link>

        {/* 🔗 Nav Links (Right Side) */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              location.pathname === '/'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              location.pathname === '/about'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            About
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 antialiased font-sans">
        <Navigation />

        {/* 🖥️ Dynamic Route Workspace Switcher */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home isLoading={isLoading} setIsLoading={setIsLoading} />} />
            <Route path="/about" element={<About />} />
            <Route path="/result" element={<Result setIsLoading={setIsLoading} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}