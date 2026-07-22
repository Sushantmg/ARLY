import { useState } from 'react';
import type { StoreResult } from '../types/product';
import { FiChevronDown, FiChevronUp, FiExternalLink } from 'react-icons/fi';

interface StoreGridProps {
  stores: StoreResult[];
}

export default function StoreGrid({ stores }: StoreGridProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (site: string) => setExpanded((prev) => ({ ...prev, [site]: !prev[site] }));

  return (
    <div className="space-y-3">
      {stores.map((store) => {
        const isOpen = expanded[store.site] ?? false;
        return (
          <div
            key={store.site}
            className="bg-white dark:bg-[#12101f]/70 border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => toggle(store.site)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm text-gray-800 dark:text-white/90">{store.site}</span>
                <span className="text-xs text-gray-400 dark:text-white/40">{store.results.length} items</span>
              </div>
              {isOpen ? (
                <FiChevronUp className="text-gray-400 dark:text-white/40" />
              ) : (
                <FiChevronDown className="text-gray-400 dark:text-white/40" />
              )}
            </button>

            {isOpen && store.results.length > 0 && (
              <div className="border-t border-gray-100 dark:border-white/10 divide-y divide-gray-50 dark:divide-white/5">
                {store.results.map((item, i) => (
                  <div key={i} className="px-4 py-3 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-white/80 truncate">{item.title}</p>
                      {item.description && (
                        <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5 line-clamp-1">{item.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{item.price}</span>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center gap-0.5"
                        >
                          <FiExternalLink />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
