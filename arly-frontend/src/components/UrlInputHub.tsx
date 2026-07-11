import { useState } from 'react';
interface UrlInputHubProps {
  onUrlSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function UrlInputHub({ onUrlSubmit, isLoading }: UrlInputHubProps) {
  const [urlInput, setUrlInput] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    
    if (!urlInput.trim() || !urlInput.startsWith('http')) {
      setError('Please paste a valid website URL starting with http:// or https://');
      return;
    }

    setError('');
    onUrlSubmit(urlInput);
  };

  return (
    <div className="w-full max-w-3xl mx-auto pt-12 pb-6 px-4 text-center">
      <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">
        ARLY <span className="text-blue-600 font-medium text-3xl">Scraper Engine</span>
      </h1>
      <p className="text-base text-gray-600 font-medium mb-8 max-w-lg mx-auto">
        Paste any e-commerce product link below to automatically extract live pricing, stock data, and specifications.
      </p>

      <form onSubmit={handleSubmit} className="relative rounded-xl shadow-md bg-white p-2 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            className={`block w-full rounded-lg border-0 py-3.5 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm bg-gray-50/50 outline-none transition-all ${
              error ? 'ring-2 ring-red-500 focus:ring-red-500 bg-red-50/30' : ''
            }`}
            placeholder="Paste product link here (e.g., https://amazon.com/item)..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:bg-blue-400 core-btn transition-all whitespace-nowrap"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Extracting...
              </span>
            ) : (
              'Extract Product'
            )}
          </button>
        </div>
      </form>
      {error && <p className="mt-3 text-sm text-red-600 text-left pl-2 font-medium">⚠️ {error}</p>}
    </div>
  );
}