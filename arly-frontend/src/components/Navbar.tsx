import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, LogIn, LogOut, Shield, ChevronDown, Gem, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
}

export default function Navbar({ isDark, setIsDark }: NavbarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const premiumUntil = user?.premium_until;
  const premiumDaysLeft = useMemo(() => {
    if (!premiumUntil) return 0;
    const now = new Date();
    const until = new Date(premiumUntil);
    const diff = until.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [premiumUntil]);

  const userInitial = user?.username?.charAt(0).toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="mx-auto max-w-7xl">
        <nav
          className="
            flex items-center justify-between rounded-2xl px-6 py-3
            border border-white/20 bg-white/60 backdrop-blur-2xl
            shadow-[0_8px_32px_rgba(0,0,0,0.08)]
            dark:border-violet-500/10 dark:bg-[#12101f]/70
            dark:shadow-[0_8px_32px_rgba(124,58,237,0.12)]
            transition-colors duration-300
          "
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-violet-500 blur-md opacity-40 group-hover:opacity-70 transition" />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 text-white font-black text-lg shadow-lg">
                A
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                ARLY
              </h1>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 -mt-1 tracking-widest uppercase">
                AI Product Finder
              </p>
            </div>
          </Link>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center rounded-xl bg-white/40 dark:bg-white/5 p-1 backdrop-blur-lg">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      active
                        ? "text-violet-700 dark:text-violet-300"
                        : "text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {active && (
                      <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-500/15 to-blue-500/15 border border-violet-200/60 dark:from-violet-500/20 dark:to-blue-500/20 dark:border-violet-500/30" />
                    )}
                    <span className="relative">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="
                relative flex h-9 w-9 items-center justify-center rounded-lg
                bg-white/40 hover:bg-white/70 text-gray-600 hover:text-violet-700
                dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 dark:hover:text-violet-300
                backdrop-blur-lg transition-all duration-300
              "
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Auth section */}
            {!user ? (
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all"
              >
                <LogIn size={15} />
                Login
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-xl bg-white/40 hover:bg-white/70 dark:bg-white/5 dark:hover:bg-white/10 p-1 pr-3 backdrop-blur-lg transition-all duration-300"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 text-white text-xs font-bold shadow-md">
                    {userInitial}
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-gray-500 dark:text-white/50 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#12101f] shadow-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {user.username}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-white/40 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    <div className="px-5 py-3 border-b border-gray-100 dark:border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-400 dark:text-white/40">Role</span>
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
                          <Shield size={10} />
                          {user.role}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-400 dark:text-white/40">Tier</span>
                        {user.is_premium ? (
                          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            <Gem size={10} />
                            Diamond VIP
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40">
                            Free Tier
                          </span>
                        )}
                      </div>
                      {user.is_premium && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-400 dark:text-white/40">Days Left</span>
                          <span className="text-xs font-bold text-gray-700 dark:text-white/70">
                            {premiumDaysLeft} days
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="px-3 py-2">
                      {user.is_premium === false && (
                        <Link
                          to="/purchase"
                          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors"
                        >
                          <Gem size={15} />
                          Upgrade to VIP
                        </Link>
                      )}
                      {user.role === "admin" && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <Shield size={15} />
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/40 hover:bg-white/70 text-gray-600 hover:text-violet-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 dark:hover:text-violet-300 backdrop-blur-lg transition-all duration-300"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/40 hover:bg-white/70 text-gray-600 hover:text-violet-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 dark:hover:text-violet-300 backdrop-blur-lg transition-all duration-300"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 rounded-2xl border border-white/20 bg-white/90 backdrop-blur-2xl shadow-2xl dark:border-violet-500/10 dark:bg-[#12101f]/90 p-4 space-y-2">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    active
                      ? "bg-gradient-to-r from-violet-500/15 to-blue-500/15 text-violet-700 dark:text-violet-300 border border-violet-200/60 dark:border-violet-500/30"
                      : "text-gray-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-white/5"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="border-t border-gray-200 dark:border-white/10 pt-2 mt-2">
              {!user ? (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg"
                >
                  <LogIn size={15} />
                  Login
                </Link>
              ) : (
                <>
                  <div className="px-4 py-3">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{user.username}</p>
                    <p className="text-xs text-gray-500 dark:text-white/40">{user.email}</p>
                  </div>
                  {user.is_premium === false && (
                    <Link
                      to="/purchase"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors"
                    >
                      <Gem size={15} />
                      Upgrade to VIP
                    </Link>
                  )}
                  {user.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    >
                      <Shield size={15} />
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
