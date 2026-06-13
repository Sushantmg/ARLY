
import type { ProductData } from '../types/product';

interface ProductCardProps {
  product: ProductData;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mt-6 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl">
      <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
        
        {/* Placeholder Product Image Layout */}
        <div className="w-full sm:w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200 shrink-0">
          <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Product Details Content */}
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
              {product.websiteName}
            </span>
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${
              product.availability.toLowerCase().includes('in stock') 
                ? 'bg-green-50 text-green-700 ring-green-600/20' 
                : 'bg-amber-50 text-amber-700 ring-amber-600/20'
            }`}>
              {product.availability}
            </span>
          </div>

          <h2 className="text-xl font-bold text-gray-900 tracking-tight line-clamp-2 mb-3">
            {product.productTitle}
          </h2>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-baseline justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Extracted Price</p>
              <p className="text-3xl font-black text-gray-900 tracking-tight mt-1">{product.price}</p>
            </div>
            
            <a
              href={product.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-500 group transition-colors"
            >
              View original store link
              <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}