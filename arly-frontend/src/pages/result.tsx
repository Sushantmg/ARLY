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
  
  const targetUrl = searchParams.get('url') || '';

  useEffect(() => {
    if (!targetUrl) {
      navigate('/');
      return;
    }

    setIsLoading(true);

    const timer = setTimeout(() => {
      const mockResult: ProductData = {
        status: "success",
        websiteName: "Amazon Store",
        productTitle: "Logitech MX Master 3S Wireless Performance Mouse - Ergonomic Design",
        price: "$99.99",
        availability: "In Stock",
        productUrl: targetUrl,
        imageUrl: "https://via.placeholder.com/150"
      };
      
      setScrapedData(mockResult);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [targetUrl, navigate, setIsLoading]);

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto pt-6">
        {scrapedData ? (
          <div>
            <div className="mb-6 flex justify-between items-center px-4">
              <h2 className="text-xl font-bold text-gray-800">Scraping Results</h2>
              <button 
                onClick={() => navigate('/')} 
                className="text-sm font-semibold text-blue-600 hover:text-blue-500"
              >
                ← Scrape Another Item
              </button>
            </div>
            <ProductCard product={scrapedData} />
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
            <p className="text-gray-500 font-medium">Parsing marketplace data nodes from: <br/><span className="text-xs text-gray-400 break-all">{targetUrl}</span></p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}