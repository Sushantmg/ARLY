import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import PageTransition from '../components/PageTransition';
import Skeleton from '../components/Skeleton';
import type { BackendProduct, CompareResponse, ProductLookupResponse } from '../types/product';
import { useAuth } from '../context/AuthContext';
import { recordScrape } from '../lib/history';
import { ExternalLink, TrendingDown, Clock, CheckCircle, ChevronDown } from 'lucide-react';

// olizstore.com flows through the generic extract+compare path (query_scrapper),
// not the catalog product-lookup — the lookup adapter only handles /products/ URLs.
const CATALOG_DOMAINS = ['brother-mart.com'];

function isCatalogDomain(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return CATALOG_DOMAINS.some((d) => host === d || host.endsWith('.' + d));
  } catch {
    return false;
  }
}

function buildSummary(product: BackendProduct): string {
  const parts: string[] = [];
  const name = product.product_name || [product.brand, 'product'].filter(Boolean).join(' ');
  parts.push(`${name} is a ${product.category || 'product'}${product.brand ? ` by ${product.brand}` : ''} currently listed at Rs. ${product.current_price != null ? product.current_price.toLocaleString() : 'N/A'}${product.source_site ? ` on ${product.source_site}` : ''}.`);

  if (product.original_price != null && product.current_price != null && product.original_price > product.current_price) {
    const savings = product.original_price - product.current_price;
    const pct = Math.round((savings / product.original_price) * 100);
    parts.push(`It is priced ${pct}% below its original price of Rs. ${product.original_price.toLocaleString()}.`);
  }

  parts.push(product.availability === true ? 'It is currently in stock.' : product.availability === false ? 'It is currently out of stock.' : '');

  const s = product.key_specs || {};
  const specBits: string[] = [];
  if (s.processor) specBits.push(`a ${s.processor} processor`);
  if (s.ram) specBits.push(`${s.ram} RAM`);
  if (s.storage) specBits.push(`${s.storage} storage`);
  if (s.display_size) specBits.push(`${s.display_size}" display`);
  if (s.display_resolution) specBits.push(`${s.display_resolution} resolution`);
  if (s.battery) specBits.push(`${s.battery} battery`);
  if (s.camera) specBits.push(`${s.camera} main camera`);
  if (s.os) specBits.push(`${s.os}`);
  if (specBits.length) parts.push(`Key specs: ${specBits.join(', ')}.`);

  return parts.filter(Boolean).join(' ');
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
                Product Links
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
  const { user } = useAuth();
  const [product, setProduct] = useState<BackendProduct | null>(null);
  const [extractionMethod, setExtractionMethod] = useState<string>('');
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

          recordScrape(user?.id, {
            url: targetUrl,
            product_name: data.product.product_name,
            brand: data.product.brand,
            category: data.product.category,
            current_price: data.product.current_price,
            source_site: data.product.source_site,
            source_url: data.product.source_url,
            image_url: data.product.image_url,
            method: data.method,
            result_data: data,
          });

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
  }, [targetUrl, setIsLoading, user?.id]);

  const sameProducts = compareData?.same_products ?? [];
  const summary = product ? buildSummary(product) : '';

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

          {summary && (
            <div className="mt-4 px-4">
              <div className="bg-[#FBFAF6] dark:bg-[#12101f]/50 border border-[#16181F]/8 dark:border-white/10 rounded-xl p-5">
                <p className="text-xs font-semibold text-[#D98E1B] uppercase tracking-wider mb-2">Product Summary</p>
                <p className="text-sm text-gray-700 dark:text-white/80 leading-relaxed">{summary}</p>
              </div>
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
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">Price Comparison</h3>
                <span className="text-xs text-gray-400 dark:text-white/40">
                  {compareData.total_products} products analyzed
                </span>
              </div>

              <details className="group bg-white dark:bg-[#12101f]/50 border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden mt-2">
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-700 dark:text-white/80 flex items-center justify-between">
                  <span className="truncate">
                    {sameProducts.length > 0
                      ? `${product.product_name || 'Product'} — Product links (${sameProducts.length})`
                      : `${product.product_name || 'Product'} — No same products found across sites`}
                  </span>
                  {sameProducts.length > 0 && (
                    <ChevronDown size={16} className="transition-transform group-open:rotate-180 text-gray-400" />
                  )}
                </summary>
                {sameProducts.length > 0 && (
                  <div className="border-t border-gray-100 dark:border-white/10 divide-y divide-gray-50 dark:divide-white/5">
                    {sameProducts.map((alt, i) => (
                      <div key={i} className="px-4 py-3 flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-white/80 truncate">{alt.title}</p>
                          {alt.site && (
                            <p className="text-xs text-gray-400 dark:text-white/40">{alt.site}</p>
                          )}
                          {alt.link && (
                            <a
                              href={alt.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 mt-0.5"
                            >
                              view <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{alt.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </details>
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
  const { user } = useAuth();
  const targetUrl = searchParams.get('url') || '';
  const useCatalogFlow = isCatalogDomain(targetUrl);
  const [catalogLookup, setCatalogLookup] = useState<ProductLookupResponse | null>(null);
  const [loading, setLoading] = useState(useCatalogFlow);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!targetUrl) {
      navigate('/');
      return;
    }

    if (!useCatalogFlow) return;

    let cancelled = false;

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

          const product = data.product;
          recordScrape(user?.id, {
            url: targetUrl,
            product_name: [product.brand, product.model].filter(Boolean).join(' ') || product.raw_title,
            brand: product.brand,
            category: product.category,
            current_price: product.price_min,
            source_site: product.source_site,
            source_url: product.source_url,
            image_url: product.image_url,
            result_data: data,
          });
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
  }, [targetUrl, navigate, useCatalogFlow, user?.id]);

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
