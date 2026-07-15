import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import PageTransition from '../components/PageTransition';
import type { ProductData } from '../types/product';

interface ResultProps {
  setIsLoading: (loading: boolean) => void;
}

export default function Result({ setIsLoading }: ResultProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [scrapedData, setScrapedData] = useState<ProductData | null>(null);
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
          setScrapedData({
            status: 'success',
            websiteName: p.source_site || 'Unknown',
            productTitle: p.product_name || 'Untitled product',
            price: p.current_price != null ? `Rs. ${p.current_price.toLocaleString()}` : 'N/A',
            availability: p.availability === false ? 'Out of Stock' : 'In Stock',
            productUrl: p.source_url || targetUrl,
            imageUrl: p.image_url && p.image_url !== 'not available' ? p.image_url : '',
          } as ProductData);
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