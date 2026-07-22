/** Product extracted by query_scrapper pipeline */
export interface BackendProduct {
  product_name: string | null;
  brand: string | null;
  category: string | null;  // laptop | mobile | electronics | accessory
  key_specs: Record<string, string>;
  current_price: number | null;
  original_price: number | null;
  availability: boolean | null;
  search_queries: string[];
  source_site: string;
  source_url: string;
  image_url: string;
}

/** Single item from a store scraper */
export interface StoreItem {
  title: string;
  price: string;
  description: string;
  link: string;
}

/** Results from one store in store_results[] */
export interface StoreResult {
  site: string;
  results: StoreItem[];
}

/** Full POST / response from query_scrapper */
export interface ScrapeResponse {
  success: boolean;
  product?: BackendProduct;
  method?: string;  // json-ld | og-meta | dom-fallback | llm
  store_results?: StoreResult[];
  error?: string;
}

// ── Compare types (from /compare-api/compare) ──────────────

export interface CheaperAlternative {
  product: string;
  description: string;
  price: string;
  savings: string;
  link: string;
}

export interface SimilarProduct {
  product: string;
  description: string;
  price: string;
  link: string;
}

export interface CompareResponse {
  query: string;
  source: {
    name: string;
    brand: string;
    price: number;
    site: string;
  };
  scraped_at: string;
  total_products: number;
  most_relevant: string;
  cheaper_alternatives: CheaperAlternative[];
  other_similar: SimilarProduct[];
  interpretation: string | null;
}
