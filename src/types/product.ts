
// Define product interfaces with proper optional properties
export interface ExtendedProduct {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category: string;
  image?: string | null;
  stock?: number | null;
  barcode?: string | null;
  status?: string | null;
  rating?: number | null;
  is_new?: boolean | null;
  time_left?: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  isNew?: boolean;
  timeLeft?: string;
}

export interface ProductsContextType {
  products: Product[];
  allProducts: Product[];
  categories: string[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  isLoading: boolean;
  isDemo: boolean;
  errorMessage: string | null;
}
