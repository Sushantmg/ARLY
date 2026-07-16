import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, Users, CreditCard, TrendingUp, Activity, BarChart3, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface MetricCard {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
}

const MOCK_METRICS: MetricCard[] = [
  { label: "Total Users", value: "12,847", change: "+14.2%", positive: true, icon: <Users size={20} /> },
  { label: "Active Subscriptions", value: "3,291", change: "+8.7%", positive: true, icon: <CreditCard size={20} /> },
  { label: "Monthly Revenue", value: "$48,520", change: "+22.4%", positive: true, icon: <TrendingUp size={20} /> },
  { label: "Scrapes Today", value: "1,483", change: "-3.1%", positive: false, icon: <Activity size={20} /> },
];

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const accessDenied = useMemo(
    () => !authLoading && (!user || user.role !== "admin"),
    [user, authLoading]
  );

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
          Overview of your application metrics and performance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_METRICS.map((metric) => (
          <div
            key={metric.label}
            className="bg-white dark:bg-[#12101f]/70 border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
                {metric.icon}
              </div>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  metric.positive
                    ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                    : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                }`}
              >
                {metric.change}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-white/50">{metric.label}</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mt-1">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#12101f]/70 border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-violet-500" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
              Revenue Trend
            </h2>
          </div>
          <div className="h-48 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-400 dark:text-white/30">
              Revenue chart placeholder
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#12101f]/70 border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-violet-500" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
              User Activity
            </h2>
          </div>
          <div className="h-48 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-400 dark:text-white/30">
              Activity chart placeholder
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
