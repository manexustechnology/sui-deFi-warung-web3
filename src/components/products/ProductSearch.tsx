
import React from 'react';
import { Search } from 'lucide-react';
import { useProducts } from '@/context/ProductsContext';

export const ProductSearch = () => {
  const { searchTerm, setSearchTerm } = useProducts();

  return (
    <div className="relative flex-grow max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 w-full py-3 rounded-full border border-border focus:outline-none focus:ring-1 focus:ring-accent"
      />
    </div>
  );
};
