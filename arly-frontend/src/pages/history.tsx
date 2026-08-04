import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';
import { fetchHistory, deleteHistoryEntry } from '../lib/history';
import type { ScrapeHistoryEntry } from '../types/product';
import { History as HistoryIcon, ExternalLink, Trash2, RefreshCw, Clock, ImageOff, Loader2 } from 'lucide-react';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function priceDisplay(entry: ScrapeHistoryEntry): string {
  return entry.current_price != null ? `Rs. ${Number(entry.current_price).toLocaleString()}` : '—';
}

export default function HistoryPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [entries, setEntries] = useState<ScrapeHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;

    fetchHistory(user.id)
      .then((data) => {
        if (cancelled) return;
        setEntries(data);
        setError('');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load history');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [authLoading, user, user?.id]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await deleteHistoryEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete entry');
    } finally {
      setDeleting(null);
    }
  };

  const productName = (e: ScrapeHistoryEntry) =>
    e.product_name || e.brand || e.url.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'Untitled product';

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <span className="inline-flex items-center rounded-md bg-violet-50 dark:bg-violet-900/20 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:text-violet-400 ring-1 ring-inset ring-violet-700/10 mb-3">
            <HistoryIcon size={12} className="mr-1" />
            Scrape History
          </span>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
            What you've scraped
          </h1>
          <p className="text-sm text-gray-500 dark:text-white/50 mt-1">
            A record of every product you've looked up, newest first.
          </p>
        </div>

        {!authLoading && !user && (
          <div className="text-center py-16 bg-white/60 dark:bg-[#12101f]/50 border border-gray-100 dark:border-white/10 rounded-2xl">
            <HistoryIcon className="mx-auto text-gray-300 dark:text-white/20 mb-4" size={40} />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Sign in to see your history</h2>
            <p className="text-sm text-gray-500 dark:text-white/50 mt-1 mb-6">
              Your scrapes are saved per account so you can revisit them anytime.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20"
            >
              Login
            </Link>
          </div>
        )}

        {user && loading && (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white/60 dark:bg-[#12101f]/50 border border-gray-100 dark:border-white/10 rounded-2xl p-5 h-24" />
            ))}
          </div>
        )}

        {user && !loading && error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 text-sm rounded-2xl p-4 mb-4">
            {error}
          </div>
        )}

        {user && !loading && entries.length === 0 && !error && (
          <div className="text-center py-16 bg-white/60 dark:bg-[#12101f]/50 border border-gray-100 dark:border-white/10 rounded-2xl">
            <HistoryIcon className="mx-auto text-gray-300 dark:text-white/20 mb-4" size={40} />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">No scrapes yet</h2>
            <p className="text-sm text-gray-500 dark:text-white/50 mt-1 mb-6">
              Paste a product URL on the home page and it'll show up here.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20"
            >
              Scrape a product
            </Link>
          </div>
        )}

        {user && !loading && entries.length > 0 && (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-4 bg-white/60 dark:bg-[#12101f]/50 border border-gray-100 dark:border-white/10 rounded-2xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 overflow-hidden">
                  {entry.image_url && entry.image_url !== 'not available' ? (
                    <img src={entry.image_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ImageOff size={20} className="text-gray-300 dark:text-white/20" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-gray-900 dark:text-white truncate">{productName(entry)}</p>
                    {entry.brand && (
                      <span className="shrink-0 inline-flex items-center rounded-md bg-violet-50 dark:bg-violet-500/10 px-1.5 py-0.5 text-[11px] font-semibold text-violet-600 dark:text-violet-400">
                        {entry.brand}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-white/50 truncate">
                    {entry.category && <span className="capitalize">{entry.category}</span>}
                    {entry.source_site && <span>{entry.category ? ' · ' : ''}{entry.source_site}</span>}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-white/40 flex items-center gap-1 mt-0.5">
                    <Clock size={11} /> {formatDate(entry.created_at)}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <span className="text-sm font-bold text-[#D98E1B]">{priceDisplay(entry)}</span>
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/result?url=${encodeURIComponent(entry.url)}`}
                      title="Re-scrape"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
                    >
                      <RefreshCw size={15} />
                    </Link>
                    {entry.source_url && (
                      <a
                        href={entry.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open source"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(entry.id)}
                      disabled={deleting === entry.id}
                      title="Remove"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-white/50 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      {deleting === entry.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
