import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ username: false, email: false, password: false });

  const usernameValid = username.length >= 3;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 6;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({ username, email, password });
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#12101f]/70 border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 text-white font-black text-xl shadow-lg mb-4">
              A
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-gray-500 dark:text-white/50 mt-1">
              Join ARLY and start comparing prices
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, username: true }))}
                  className={`w-full rounded-xl border bg-[#FBFAF6] dark:bg-white/5 py-3 pl-10 pr-10 text-sm text-gray-900 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all ${
                    touched.username && username && !usernameValid
                      ? "border-red-400 dark:border-red-500/40"
                      : touched.username && usernameValid
                        ? "border-green-400 dark:border-green-500/40"
                        : "border-gray-200 dark:border-white/10"
                  }`}
                  placeholder="Choose a username"
                />
                {touched.username && username && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {usernameValid ? (
                      <CheckCircle2 size={16} className="text-green-500" />
                    ) : (
                      <AlertCircle size={16} className="text-red-400" />
                    )}
                  </span>
                )}
              </div>
              {touched.username && username && !usernameValid && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">Username must be at least 3 characters</p>
              )}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  className={`w-full rounded-xl border bg-[#FBFAF6] dark:bg-white/5 py-3 pl-10 pr-10 text-sm text-gray-900 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all ${
                    touched.email && email && !emailValid
                      ? "border-red-400 dark:border-red-500/40"
                      : touched.email && emailValid
                        ? "border-green-400 dark:border-green-500/40"
                        : "border-gray-200 dark:border-white/10"
                  }`}
                  placeholder="you@example.com"
                />
                {touched.email && email && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {emailValid ? (
                      <CheckCircle2 size={16} className="text-green-500" />
                    ) : (
                      <AlertCircle size={16} className="text-red-400" />
                    )}
                  </span>
                )}
              </div>
              {touched.email && email && !emailValid && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">Enter a valid email address</p>
              )}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  className={`w-full rounded-xl border bg-[#FBFAF6] dark:bg-white/5 py-3 pl-10 pr-10 text-sm text-gray-900 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all ${
                    touched.password && password && !passwordValid
                      ? "border-red-400 dark:border-red-500/40"
                      : touched.password && passwordValid
                        ? "border-green-400 dark:border-green-500/40"
                        : "border-gray-200 dark:border-white/10"
                  }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {touched.password && password && !passwordValid && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">Password must be at least 6 characters</p>
              )}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-white/50">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
