import { Link, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

interface NavbarProps {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
}

export default function Navbar({ isDark, setIsDark }: NavbarProps) {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ];

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
                AI Resume Analyzer
              </p>
            </div>
          </Link>

          {/* Right side: nav + theme toggle */}
          <div className="flex items-center gap-3">
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
                      <span
                        className="
                          absolute inset-0 rounded-lg
                          bg-gradient-to-r from-violet-500/15 to-blue-500/15
                          border border-violet-200/60
                          dark:from-violet-500/20 dark:to-blue-500/20 dark:border-violet-500/30
                        "
                      />
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
          </div>
        </nav>
      </div>
    </header>
  );
}