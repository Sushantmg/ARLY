import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import StoreGrid from '../components/StoreGrid';
import Skeleton from '../components/Skeleton';
import type { BackendProduct, StoreResult, CompareResponse, ProductLookupResponse } from '../types/product';
import { ExternalLink, TrendingDown, Package, Clock, CheckCircle } from 'lucide-react';

const CATALOG_DOMAINS = ['olizstore.com', 'brother-mart.com'];

function isCatalogDomain(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return CATALOG_DOMAINS.some((d) => host === d || host.endsWith('.' + d));
  } catch {
    return false;
  }
}

interface ResultProps {
  setIsLoading: (loading: boolean) => void;
}

function CatalogResult({ lookup }: { lookup: ProductLookupResponse }) {
  const { product, matches, source } = lookup;
  const hasMatches = matches.tier1.length + matches.tier2.length + matches.tier3.length > 0;
  const priceDisplay = product.price_min ? `Rs. ${product.price_min.toLocaleString()}` : 'N/A';
  const availColor = product.availability_normalized === 'in_stock'
    ? 'text-green-600 dark:text-green-400'
    : product.availability_normalized === 'out_of_stock'
    ? 'text-red-600 dark:text-red-400'
    : 'text-gray-500 dark:text-white/50';

  return (
    <>
      <div className="bg-white/60 dark:bg-[#12101f]/70 border border-[#16181F]/8 dark:border-white/10 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-[#D98E1B] uppercase tracking-wider">{product.category}</span>
          {product.needs_review && (
            <span className="text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-full">needs review</span>
          )}
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white/90 mb-1" style={{ fontFamily: "'Fraunces', serif" }}>
          {product.brand} {product.model}
        </h2>
        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-2xl font-bold text-[#D98E1B]">{priceDisplay}</span>
          <span className="text-xs text-gray-400 dark:text-white/40">{product.currency}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className={`flex items-center gap-1 font-medium ${availColor}`}>
            {product.availability_normalized === 'in_stock' ? <CheckCircle size={14} /> : <Clock size={14} />}
            {product.availability_raw}
          </span>
          <span className="text-xs text-gray-400 dark:text-white/40">
            Source: {product.source_site}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            source === 'cache'
              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
              : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
          }`}>
            {source === 'cache' ? 'cached' : 'live'}
          </span>
        </div>
        <a
          href={product.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 mt-3"
        >
          View on {product.source_site} <ExternalLink size={12} />
        </a>
      </div>

      {lookup.verdict && (
        <div className="mx-4 mb-6 bg-[#FBFAF6] dark:bg-[#12101f]/50 border border-[#D98E1B]/30 dark:border-[#D98E1B]/20 rounded-xl p-4">
          <p className="text-xs font-semibold text-[#D98E1B] uppercase tracking-wider mb-1">Cheapest Price Verdict</p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90 leading-relaxed">{lookup.verdict}</p>
        </div>
      )}

      {hasMatches && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white/90 px-4">Cross-Store Comparison</h3>

          {matches.tier1.length > 0 && (
            <div className="px-4">
              <p className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <TrendingDown size={14} /> Exact Matches
              </p>
              <div className="space-y-3">
                {matches.tier1.map((m, i) => (
                  <MatchCard key={i} match={m} />
                ))}
              </div>
            </div>
          )}

          {matches.tier2.length > 0 && (
            <div className="px-4">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">
                Closest Variants
              </p>
              <div className="space-y-3">
                {matches.tier2.map((m, i) => (
                  <MatchCard key={i} match={m} />
                ))}
              </div>
            </div>
          )}

          {matches.tier3.length > 0 && (
            <div className="px-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider mb-2">
                Similar Alternatives
              </p>
              <div className="space-y-3">
                {matches.tier3.map((m, i) => (
                  <MatchCard key={i} match={m} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!hasMatches && !lookup.verdict && (
        <p className="text-sm text-gray-400 dark:text-white/40 text-center py-4">
          No cross-store matches found yet. Run the catalog crawler to populate the cache.
        </p>
      )}
    </>
  );
}

function MatchCard({ match }: { match: ProductLookupResponse['matches']['tier1'][0] }) {
  const { product } = match;
  const priceDisplay = product.price_min ? `Rs. ${product.price_min.toLocaleString()}` : 'N/A';

  return (
    <div className={`bg-white dark:bg-[#12101f]/70 border rounded-xl p-4 ${
      match.is_cheapest
        ? 'border-green-300 dark:border-green-800/40'
        : 'border-gray-100 dark:border-white/5'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="font-semibold text-gray-900 dark:text-white/90 text-sm">
            {product.brand} {product.model}
          </p>
          <p className="text-xs text-gray-500 dark:text-white/50 mt-0.5">
            {product.source_site}
            {product.storage_gb ? ` · ${product.storage_gb}` : ''}
            {product.ram_gb ? ` · ${product.ram_gb}GB RAM` : ''}
          </p>
          <p className="text-[11px] text-gray-400 dark:text-white/40 mt-1">{match.label}</p>
        </div>
        <div className="text-right shrink-0">
          <p className={`font-bold ${match.is_cheapest ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
            {priceDisplay}
          </p>
        </div>
      </div>
      <a
        href={product.source_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 mt-2"
      >
                            View store <ExternalLink size={12} />
      </a>
    </div>
  );
}

function LegacyResult({ targetUrl, setIsLoading }: { targetUrl: string; setIsLoading: (l: boolean) => void }) {
  const navigate = useNavigate();
  const [product, setProduct] = useState<BackendProduct | null>(null);
  const [extractionMethod, setExtractionMethod] = useState<string>('');
  const [storeResults, setStoreResults] = useState<StoreResult[]>([]);
  const [compareData, setCompareData] = useState<CompareResponse | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetch('/api/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: targetUrl }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (data.success && data.product) {
          setProduct(data.product);
          setExtractionMethod(data.method || '');
          setStoreResults(data.store_results || []);

          setCompareLoading(true);
          fetch('/compare-api/compare', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product: data.product }),
          })
            .then((r) => {
              if (!r.ok) throw new Error(`Compare returned ${r.status}`);
              return r.json();
            })
            .then((cmp) => {
              if (!cancelled) setCompareData(cmp);
            })
            .catch(() => {})
            .finally(() => {
              if (!cancelled) setCompareLoading(false);
            });
        } else {
          setError(data.error || 'Extraction failed');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'Failed to connect to backend');
        setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [targetUrl, setIsLoading]);

  const totalStoreItems = storeResults.reduce((sum, s) => sum + s.results.length, 0);

  return (
    <>
      {product ? (
        <div>
          <div className="mb-6 flex justify-between items-center px-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">Scraping Results</h2>
            <button
              onClick={() => navigate('/')}
              className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500"
            >
              ← Scrape Another Item
            </button>
          </div>

          <ProductCard product={product} method={extractionMethod} />

          {storeResults.length > 0 && (
            <div className="mt-8 px-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">Store Inventory</h3>
                <span className="text-xs text-gray-400 dark:text-white/40">
                  {totalStoreItems} products across {storeResults.length} stores
                </span>
              </div>
              <StoreGrid stores={storeResults} />
            </div>
          )}

          {compareLoading && (
            <div className="mt-6 space-y-6 px-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-[#12101f]/70 border border-gray-100 dark:border-white/10 rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                      <div className="text-right space-y-2 shrink-0">
                        <Skeleton className="h-5 w-20 ml-auto" />
                        <Skeleton className="h-3 w-16 ml-auto" />
                      </div>
                    </div>
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {compareData && (
            <div className="mt-6 space-y-6 px-4">
              {compareData.interpretation && (
                <div className="bg-[#FBFAF6] dark:bg-[#12101f]/50 border border-[#16181F]/8 dark:border-white/10 rounded-xl p-5">
                  <p className="text-xs font-semibold text-[#D98E1B] uppercase tracking-wider mb-2">AI Analysis</p>
                  <p className="text-sm text-gray-700 dark:text-white/80 leading-relaxed whitespace-pre-line">{compareData.interpretation}</p>
                </div>
              )}

              {compareData.cheapest && (
                <div className="bg-[#FBFAF6] dark:bg-[#12101f]/50 border border-[#D98E1B]/30 dark:border-[#D98E1B]/20 rounded-xl p-4">
                  <p className="text-xs font-semibold text-[#D98E1B] uppercase tracking-wider mb-1">Cheapest Price Verdict</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90 leading-relaxed">{compareData.cheapest}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">Price Comparison</h3>
                <span className="text-xs text-gray-400 dark:text-white/40">
                  {compareData.total_products} products analyzed
                </span>
              </div>

              {compareData.most_relevant && (
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl p-4">
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Package size={14} /> Best Match
                  </p>
                  <p className="text-sm text-gray-700 dark:text-white/80 leading-relaxed">{compareData.most_relevant}</p>
                </div>
              )}

              {compareData.cheaper_alternatives.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-1.5">
                    <TrendingDown size={14} /> Cheaper Alternatives Found
                  </p>
                  <div className="space-y-3">
                    {compareData.cheaper_alternatives.map((alt, i) => (
                        <div key={i} className="bg-white dark:bg-[#12101f]/70 border border-green-200 dark:border-green-800/30 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 dark:text-white/90 text-sm">{alt.product}</p>
                            <p className="text-xs text-gray-500 dark:text-white/50 mt-1">{alt.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-gray-900 dark:text-white">{alt.price}</p>
                            <p className="text-xs font-semibold text-green-600 dark:text-green-400">{alt.savings}</p>
                          </div>
                        </div>
                        {alt.link && (
                          <a
                            href={alt.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 mt-2"
                          >
        View store <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {compareData.other_similar.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-gray-600 dark:text-white/60 mb-3">Other Similar Products</p>
                  <div className="space-y-2">
                    {compareData.other_similar.map((sim, i) => (
                      <div key={i} className="bg-white dark:bg-[#12101f]/50 border border-gray-100 dark:border-white/5 rounded-xl p-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 dark:text-white/80 text-sm">{sim.product}</p>
                          <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5">{sim.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{sim.price}</p>
                          {sim.link && (
                            <a
                              href={sim.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500"
                            >
                              view <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {compareData.cheaper_alternatives.length === 0 && compareData.other_similar.length === 0 && !compareData.cheapest && (
                <p className="text-sm text-gray-400 dark:text-white/40 text-center py-4">
                  No alternatives found in scraped stores.
                </p>
              )}
            </div>
          )}
        </div>
      ) : error ? (
        <div className="text-center py-12 px-4">
          <p className="text-[#B23A48] dark:text-red-400 font-semibold mb-2">Extraction failed</p>
          <p className="text-sm text-gray-500 dark:text-white/60 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500"
          >
            ← Try another URL
          </button>
        </div>
      ) : null}
    </>
  );
}

export default function Result({ setIsLoading }: ResultProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [catalogLookup, setCatalogLookup] = useState<ProductLookupResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const targetUrl = searchParams.get('url') || '';

  useEffect(() => {
    if (!targetUrl) {
      navigate('/');
      return;
    }

    if (!isCatalogDomain(targetUrl)) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch('/compare-api/product-lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: targetUrl }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (data.success) {
          setCatalogLookup(data);
        } else {
          setError(data.error || 'Product lookup failed');
        }
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'Failed to connect to backend');
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [targetUrl, navigate]);

  const useCatalogFlow = isCatalogDomain(targetUrl);

  if (useCatalogFlow && catalogLookup) {
    return (
      <PageTransition>
        <div className="max-w-3xl mx-auto pt-6 px-4">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white/90" style={{ fontFamily: "'Fraunces', serif" }}>
              Product Lookup
            </h2>
            <button
              onClick={() => navigate('/')}
              className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500"
            >
              ← Look Up Another
            </button>
          </div>
          <CatalogResult lookup={catalogLookup} />
        </div>
      </PageTransition>
    );
  }

  if (useCatalogFlow && error) {
    return (
      <PageTransition>
        <div className="max-w-3xl mx-auto pt-6 px-4">
          <div className="text-center py-12">
            <p className="text-[#B23A48] dark:text-red-400 font-semibold mb-2">Product lookup failed</p>
            <p className="text-sm text-gray-500 dark:text-white/60 mb-4">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500"
            >
              ← Try another URL
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (useCatalogFlow && loading) {
    return (
      <PageTransition>
        <div className="max-w-3xl mx-auto pt-6 text-center py-12">
          <div className="animate-spin h-8 w-8 text-[#D98E1B] mx-auto mb-4 border-4 border-gray-300 dark:border-white/20 border-t-[#D98E1B] rounded-full"></div>
          <p className="text-gray-500 dark:text-white/60 font-medium">
            Looking up product in catalog...<br/>
            <span className="text-xs text-gray-400 dark:text-white/40 break-all">{targetUrl}</span>
          </p>
        </div>
      </PageTransition>
    );
  }

  if (!useCatalogFlow) {
    return (
      <PageTransition>
        <div className="max-w-3xl mx-auto pt-6">
          <LegacyResult targetUrl={targetUrl} setIsLoading={setIsLoading} />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto pt-6 text-center py-12">
        <div className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-4 border-4 border-gray-300 dark:border-white/20 border-t-blue-600 dark:border-t-blue-400 rounded-full"></div>
        <p className="text-gray-500 dark:text-white/60 font-medium">Parsing marketplace data nodes from: <br/><span className="text-xs text-gray-400 dark:text-white/40 break-all">{targetUrl}</span></p>
      </div>
    </PageTransition>
  );
}
