import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { useProducts } from '@/context/ProductsContext';
import { ProductSearch } from './ProductSearch';

export const ProductFilters = () => {
  const { sortBy, setSortBy } = useProducts();
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
        <ProductSearch />
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none w-full bg-white border border-border rounded-full px-4 py-3 pr-10 focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <button 
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center justify-center space-x-2 px-4 py-3 rounded-full border border-border hover:bg-secondary transition-colors"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>
      
      <FilterCategories isOpen={isFiltersOpen} />
    </div>
  );
};

interface FilterCategoriesProps {
  isOpen: boolean;
}

export const FilterCategories = ({ isOpen }: FilterCategoriesProps) => {
  const { categories, activeFilter, setActiveFilter } = useProducts();

  return (
    <div className={`glass p-6 rounded-2xl mb-8 transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0 opacity-0 pointer-events-none'}`}>
      <div className="font-medium mb-4">Categories</div>
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${activeFilter === 'all' ? 'bg-accent text-white' : 'bg-secondary hover:bg-secondary/80'}`}
        >
          All Products
        </button>
        {categories.map((category) => (
          <button 
            key={category}
            onClick={() => setActiveFilter(category.toLowerCase())}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${activeFilter === category.toLowerCase() ? 'bg-accent text-white' : 'bg-secondary hover:bg-secondary/80'}`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
