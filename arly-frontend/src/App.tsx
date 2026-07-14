import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './pages/footer';
import Home from './pages/home';
import About from './pages/about';
import Result from './pages/result';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <div className="min-h-screen bg-[#F1F3F6] dark:bg-[#0A0C10] transition-colors duration-300">
      <Navbar isDark={isDark} setIsDark={setIsDark} />
      <Routes>
        <Route path="/" element={<Home isLoading={isLoading} setIsLoading={setIsLoading} />} />
        <Route path="/result" element={<Result setIsLoading={setIsLoading} />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </div>
  );
}
