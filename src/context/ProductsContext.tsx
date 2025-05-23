
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ProductsContextType } from '@/types/product';
import { useProductsFetcher } from '@/hooks/useProductsFetcher';
import { filterProducts } from '@/utils/productUtils';

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

interface ProductsProviderProps {
  children: ReactNode;
  initialFilter?: string;
}

export { type Product };

export const ProductsProvider: React.FC<ProductsProviderProps> = ({ 
  children, 
  initialFilter = 'all' 
}) => {
  const { allProducts, categories, isLoading, isDemo, errorMessage } = useProductsFetcher();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    // Apply filters and sorting to get filtered products
    const filteredProducts = filterProducts(allProducts, activeFilter, searchTerm, sortBy);
    setProducts(filteredProducts);
  }, [activeFilter, searchTerm, sortBy, allProducts]);

  const value = {
    products,
    allProducts,
    categories,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    sortBy,
    setSortBy,
    isLoading,
    isDemo,
    errorMessage
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
