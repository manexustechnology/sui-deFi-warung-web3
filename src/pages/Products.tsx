import React from 'react';
import { useLocation } from 'react-router-dom';
import AIAssistant from '../components/ui/AIAssistant';
import { DatabaseErrorAlert } from '@/components/ui/DatabaseErrorAlert';
import { ProductsProvider, useProducts } from '@/context/ProductsContext';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductsGrid } from '@/components/products/ProductsGrid';

const ProductsContent = () => {
  const { isDemo, errorMessage } = useProducts();

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Explore Products</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover a wide range of digital and physical products available on our decentralized Algorand marketplace.
        </p>
      </div>
      
      {/* Database status notification */}
      {isDemo && (
        <DatabaseErrorAlert 
          isDemo={isDemo}
          errorMessage={errorMessage}
          className="mb-6"
        />
      )}
      
      {/* Search and filters */}
      <ProductFilters />
      
      {/* Products grid */}
      <ProductsGrid />
    </div>
  );
};

const Products = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFilter = queryParams.get('category');

  return (
    <div className="min-h-screen pt-24 pb-20">
      <ProductsProvider initialFilter={categoryFilter || 'all'}>
        <ProductsContent />
      </ProductsProvider>
      
      <AIAssistant />
    </div>
  );
};

export default Products;
