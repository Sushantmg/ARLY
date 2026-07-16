import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './pages/footer';
import Home from './pages/home';
import About from './pages/about';
import Result from './pages/result';
import Login from './pages/login';
import Register from './pages/register';
import AdminDashboard from './pages/admin-dashboard';
import Purchase from './pages/purchase';

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
    <AuthProvider>
      <div className="min-h-screen bg-[#FBFAF6] dark:bg-[#0A0C10] transition-colors duration-300">
        <Navbar isDark={isDark} setIsDark={setIsDark} />
        <Routes>
          <Route path="/" element={<Home isLoading={isLoading} setIsLoading={setIsLoading} />} />
          <Route path="/result" element={<Result setIsLoading={setIsLoading} />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/purchase" element={<Purchase />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
}
