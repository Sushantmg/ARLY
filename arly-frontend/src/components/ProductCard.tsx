import { useState } from 'react';
import { Package } from 'lucide-react';
import type { BackendProduct } from '../types/product';

interface ProductCardProps {
  product: BackendProduct;
  method?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  laptop: 'Laptop',
  mobile: 'Mobile',
  electronics: 'Electronics',
  accessory: 'Accessory',
};

export default function ProductCard({ product, method }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const hasDiscount = product.original_price != null && product.current_price != null && product.original_price > product.current_price;

  const specEntries = Object.entries(product.key_specs || {}).filter(([, v]) => v);
  const showImage = product.image_url && product.image_url !== 'not available' && !imgError;

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 bg-white dark:bg-[#12101f]/70 border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl">
      <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">

        {/* Product Image */}
        <div className="w-full sm:w-48 h-48 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center border border-gray-200 dark:border-white/10 shrink-0 overflow-hidden">
          {showImage ? (
            <img
              src={product.image_url}
              alt={product.product_name || 'Product'}
              className="w-full h-full object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-gray-300 dark:text-white/20">
              <Package size={40} strokeWidth={1.5} />
              <span className="text-[11px] font-medium">No image</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 w-full">
          {/* Badges row */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10">
              {product.source_site}
            </span>
            {product.category && (
              <span className="inline-flex items-center rounded-md bg-purple-50 dark:bg-purple-900/20 px-2 py-1 text-xs font-semibold text-purple-700 dark:text-purple-400 ring-1 ring-inset ring-purple-700/10">
                {CATEGORY_LABELS[product.category] || product.category}
              </span>
            )}
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${
              product.availability === true
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 ring-green-600/20'
                : product.availability === false
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 ring-red-600/20'
                  : 'bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-white/40 ring-gray-300/20'
            }`}>
              {product.availability === true ? 'In Stock' : product.availability === false ? 'Out of Stock' : 'Unknown'}
            </span>
            {method && (
              <span className="inline-flex items-center rounded-md bg-gray-50 dark:bg-white/5 px-2 py-1 text-xs font-mono text-gray-400 dark:text-white/30 ring-1 ring-inset ring-gray-200 dark:ring-white/10">
                {method}
              </span>
            )}
          </div>

          {/* Title + brand */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white/90 tracking-tight line-clamp-2 mb-1">
            {product.product_name || 'Untitled product'}
          </h2>
          {product.brand && (
            <p className="text-sm text-gray-500 dark:text-white/50 mb-3">{product.brand}</p>
          )}

          {/* Key Specs */}
          {specEntries.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
              {specEntries.map(([key, val]) => (
                <span key={key} className="text-xs text-gray-400 dark:text-white/40">
                  <span className="font-medium text-gray-500 dark:text-white/50">{key.replace(/_/g, ' ')}</span>{': '}{val}
                </span>
              ))}
            </div>
          )}

          {/* Price section */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 flex items-baseline justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider">Price (NPR)</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  {product.current_price != null ? `Rs. ${product.current_price.toLocaleString()}` : 'N/A'}
                </p>
                {hasDiscount && (
                  <p className="text-sm line-through text-gray-400 dark:text-white/30">
                    Rs. {product.original_price!.toLocaleString()}
                  </p>
                )}
              </div>
              {hasDiscount && product.current_price != null && product.original_price != null && (
                <p className="text-xs font-semibold text-green-600 dark:text-green-400 mt-0.5">
                  Save Rs. {(product.original_price - product.current_price).toLocaleString()} ({Math.round(((product.original_price - product.current_price) / product.original_price) * 100)}% off)
                </p>
              )}
            </div>

            <a
              href={product.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 group transition-colors"
            >
              View store link
              <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
