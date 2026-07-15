import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import PageTransition from '../components/PageTransition';
import type { ProductData, CompareResponse } from '../types/product';
import { FiExternalLink, FiTrendingDown, FiPackage } from 'react-icons/fi';

interface ResultProps {
  setIsLoading: (loading: boolean) => void;
}

export default function Result({ setIsLoading }: ResultProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [scrapedData, setScrapedData] = useState<ProductData | null>(null);
  const [rawProduct, setRawProduct] = useState<Record<string, unknown> | null>(null);
  const [compareData, setCompareData] = useState<CompareResponse | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const targetUrl = searchParams.get('url') || '';

  useEffect(() => {
    if (!targetUrl) {
      navigate('/');
      return;
    }

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
          const p = data.product;
          setRawProduct(p);
          setScrapedData({
            status: 'success',
            websiteName: p.source_site || 'Unknown',
            productTitle: p.product_name || 'Untitled product',
            price: p.current_price != null ? `Rs. ${p.current_price.toLocaleString()}` : 'N/A',
            availability: p.availability === false ? 'Out of Stock' : 'In Stock',
            productUrl: p.source_url || targetUrl,
            imageUrl: p.image_url && p.image_url !== 'not available' ? p.image_url : '',
          } as ProductData);

          setCompareLoading(true);
          fetch('/compare-api/compare', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product: p }),
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
  }, [targetUrl, navigate, setIsLoading]);

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto pt-6">
        {scrapedData ? (
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
            <ProductCard product={scrapedData} />

            {compareLoading && (
              <div className="mt-6 text-center py-8">
                <div className="animate-spin h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-3 border-4 border-gray-300 dark:border-white/20 border-t-blue-600 dark:border-t-blue-400 rounded-full"></div>
                <p className="text-sm text-gray-500 dark:text-white/60">Finding cheaper alternatives across 10+ stores…</p>
              </div>
            )}

            {compareData && (
              <div className="mt-6 space-y-6 px-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">Price Comparison</h3>
                  <span className="text-xs text-gray-400 dark:text-white/40">
                    {compareData.total_products} products checked
                  </span>
                </div>

                {compareData.most_relevant && (
                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl p-4">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <FiPackage /> Best Match
                    </p>
                    <p className="text-sm text-gray-700 dark:text-white/80 leading-relaxed">{compareData.most_relevant}</p>
                  </div>
                )}

                {compareData.cheaper_alternatives.length > 0 && (
                  <div>
                    <p className="text-sm font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-1.5">
                      <FiTrendingDown /> Cheaper Alternatives Found
                    </p>
                    <div className="space-y-3">
                      {compareData.cheaper_alternatives.map((alt, i) => (
                        <div key={i} className="bg-white dark:bg-[#12101f]/70 border border-green-200 dark:border-green-800/30 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between gap-4">
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
                              View store <FiExternalLink />
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
                        <div key={i} className="bg-white dark:bg-[#12101f]/50 border border-gray-100 dark:border-white/5 rounded-xl p-3 flex items-start justify-between gap-4">
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
                                view <FiExternalLink />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {compareData.cheaper_alternatives.length === 0 && compareData.other_similar.length === 0 && (
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
        ) : (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-4 border-4 border-gray-300 dark:border-white/20 border-t-blue-600 dark:border-t-blue-400 rounded-full"></div>
            <p className="text-gray-500 dark:text-white/60 font-medium">Parsing marketplace data nodes from: <br/><span className="text-xs text-gray-400 dark:text-white/40 break-all">{targetUrl}</span></p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
