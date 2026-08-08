import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, Users, Activity, BarChart3, ArrowLeft, Loader2, ExternalLink } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

interface AdminStats {
  totalUsers: number;
  scrapesToday: number;
  totalScrapes: number;
  recentScrapes: {
    id: string;
    url: string;
    product_name: string | null;
    source_site: string | null;
    current_price: number | null;
    created_at: string;
  }[];
}

interface MetricCard {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsError, setStatsError] = useState("");
  const accessDenied = useMemo(
    () => !authLoading && (!user || user.role !== "admin"),
    [user, authLoading]
  );

  useEffect(() => {
    if (accessDenied) return;
    let cancelled = false;

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const res = await fetch("/api/auth/admin/stats", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) {
        throw new Error(`Failed to load stats (${res.status})`);
      }
      const data = await res.json();
      if (!cancelled) setStats(data);
    })().catch((err) => {
      if (!cancelled) setStatsError(err instanceof Error ? err.message : "Failed to load stats");
    });

    return () => { cancelled = true; };
  }, [accessDenied]);

  const metrics: MetricCard[] = stats
    ? [
        { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: <Users size={20} /> },
        { label: "Scrapes Today", value: stats.scrapesToday.toLocaleString(), icon: <Activity size={20} /> },
        { label: "Total Scrapes", value: stats.totalScrapes.toLocaleString(), icon: <BarChart3 size={20} /> },
      ]
    : [];

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-violet-500" />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white dark:bg-[#12101f]/70 border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 mb-6">
              <ShieldAlert size={32} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              Access Denied
            </h1>
            <p className="text-sm text-gray-500 dark:text-white/50 mb-6">
              You do not have permission to view this page. This area is restricted to administrators only.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 dark:bg-white/10 px-5 py-2.5 text-sm font-semibold text-white dark:text-white/90 hover:bg-gray-800 dark:hover:bg-white/15 transition-colors"
            >
              <ArrowLeft size={16} />
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <span className="inline-flex items-center rounded-md bg-violet-50 dark:bg-violet-900/20 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:text-violet-400 ring-1 ring-inset ring-violet-700/10 mb-3">
          Admin Panel
        </span>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-white/50 mt-1">
          Real-time overview of users and scrapes.
        </p>
      </div>

      {statsError && (
        <div className="mb-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 text-sm p-4">
          {statsError}
        </div>
      )}

      {!stats && !statsError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white/60 dark:bg-[#12101f]/50 border border-gray-100 dark:border-white/10 rounded-2xl p-6 h-32" />
          ))}
        </div>
      )}

      {metrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-white dark:bg-[#12101f]/70 border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  {metric.icon}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-white/50">{metric.label}</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mt-1">
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#12101f]/70 border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-violet-500" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
              User Activity
            </h2>
          </div>
          {!stats ? (
            <div className="h-48 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center">
              <Loader2 size={20} className="animate-spin text-violet-500" />
            </div>
          ) : stats.recentScrapes.length === 0 ? (
            <div className="h-48 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-400 dark:text-white/30">
                No scrapes yet
              </span>
            </div>
          ) : (
            <ul className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {stats.recentScrapes.map((s) => (
                <li key={s.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {s.product_name || "Untitled product"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-white/50">
                      {s.source_site || "Unknown source"}
                      {s.current_price != null && ` · Rs. ${Number(s.current_price).toLocaleString()}`}
                      {" · "}
                      {new Date(s.created_at).toLocaleString()}
                    </p>
                  </div>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink size={15} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
