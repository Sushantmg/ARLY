export interface ProductData {
  status: "success" | "error";
  websiteName: string;
  productTitle: string;
  price: string;
  availability: string;
  productUrl: string;
  imageUrl: string;
}

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
    price: string;
    site: string;
  };
  scraped_at: string;
  total_products: number;
  most_relevant: string;
  cheaper_alternatives: CheaperAlternative[];
  other_similar: SimilarProduct[];
}