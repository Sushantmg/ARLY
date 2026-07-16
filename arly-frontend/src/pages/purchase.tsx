import { useState } from "react";
import { Gem, Check, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Purchase() {
  const { user, upgradePremium } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      await upgradePremium();
      setSuccess(true);
    } catch {
      // upgrade failed — user stays on checkout
    } finally {
      setLoading(false);
    }
  };

  const isAlreadyPremium = user?.is_premium;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {success || isAlreadyPremium ? (
          <div className="bg-white dark:bg-[#12101f]/70 border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl p-10 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 text-white shadow-lg shadow-violet-500/30 mb-6">
              <ShieldCheck size={40} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              {isAlreadyPremium && !success ? "You're Already VIP" : "Welcome to Diamond VIP!"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-white/50">
              {isAlreadyPremium && !success
                ? "Your Diamond VIP subscription is active. Enjoy all premium benefits."
                : "Your account has been upgraded. Enjoy exclusive benefits and priority access."}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#12101f]/70 border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden">
            <div className="relative bg-gradient-to-br from-violet-600 via-violet-500 to-blue-600 px-8 py-12 text-center">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-8 h-2 w-2 rounded-full bg-white/60" />
                <div className="absolute top-12 right-12 h-1.5 w-1.5 rounded-full bg-white/40" />
                <div className="absolute bottom-6 left-16 h-1 w-1 rounded-full bg-white/30" />
              </div>
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm text-white mb-4">
                <Gem size={40} />
              </div>
              <h1 className="relative text-3xl font-black text-white tracking-tight">
                Diamond VIP
              </h1>
              <p className="relative text-sm text-white/70 mt-2">
                Unlock the full ARLY experience
              </p>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                    $9.99
                  </span>
                  <span className="text-sm font-medium text-gray-500 dark:text-white/50">
                    /month
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  "Unlimited product scrapes per day",
                  "Priority comparison engine access",
                  "Advanced price history tracking",
                  "Early access to new retailers",
                  "Dedicated support channel",
                  "Diamond VIP badge on your profile",
                ].map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3 text-sm text-gray-700 dark:text-white/70"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400 shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    {benefit}
                  </div>
                ))}
              </div>

              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Upgrade to VIP"
                )}
              </button>

              <p className="mt-4 text-center text-xs text-gray-400 dark:text-white/30">
                Cancel anytime. No questions asked.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
