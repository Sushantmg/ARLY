import { useState } from 'react';
import UrlInputHub from './components/UrlInputHub';
import ProductCard from './components/ProductCard';
import type { ProductData } from './types/product';

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scrapedData, setScrapedData] = useState<ProductData | null>(null);

  const handleUrlExtraction = (url: string) => {
    setIsLoading(true);
    setScrapedData(null);

    // Simulate network scraping delays (2 seconds)
    setTimeout(() => {
      const mockResult: ProductData = {
        status: "success",
        websiteName: "Amazon Store",
        productTitle: "Logitech MX Master 3S Wireless Performance Mouse - Ergonomic Design",
        price: "$99.99",
        availability: "In Stock",
        productUrl: url,
        imageUrl: "https://via.placeholder.com/150"
      };
      
      setScrapedData(mockResult);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-gray-900 antialiased font-sans">
      {/* Sleek Top Navigation Bar */}
      <nav className="border-b border-gray-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-sm">A</div>
            <span className="font-bold text-lg tracking-tight">ARLY Dashboard</span>
          </div>
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Frontend Live v1.0
          </span>
        </div>
      </nav>

      {/* Main Dashboard Space */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UrlInputHub onUrlSubmit={handleUrlExtraction} isLoading={isLoading} />
        
        {/* Render card conditionally if data exists */}
        {scrapedData && <ProductCard product={scrapedData} />}
      </main>
    </div>
  );
}