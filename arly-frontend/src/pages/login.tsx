import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
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
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 dark:text-white/50 mt-1">
              Sign in to your ARLY account
            </p>
          </div>

          <button
            type="button"
            onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-white/80 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-[#12101f]/70 px-3 text-gray-400 dark:text-white/40 font-medium">
                or sign in with email
              </span>
            </div>
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
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-[#FBFAF6] dark:bg-white/5 py-3 pl-10 pr-4 text-sm text-gray-900 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all"
                  placeholder="you@example.com"
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
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-[#FBFAF6] dark:bg-white/5 py-3 pl-10 pr-4 text-sm text-gray-900 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all"
                  placeholder="Enter your password"
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
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-white/50">
            No account?{" "}
            <Link
              to="/register"
              className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
