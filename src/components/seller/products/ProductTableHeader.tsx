
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ProductTableHeaderProps {
  sortField: 'name' | 'price' | 'stock' | 'dateAdded';
  sortDirection: 'asc' | 'desc';
  handleSort: (field: 'name' | 'price' | 'stock' | 'dateAdded') => void;
}

export const ProductTableHeader: React.FC<ProductTableHeaderProps> = ({
  sortField,
  sortDirection,
  handleSort
}) => {
  return (
    <thead>
      <tr className="border-b">
        <th className="pb-2 text-left font-medium text-sm">
          <button 
            className="flex items-center focus:outline-none" 
            onClick={() => handleSort('name')}
          >
            Product
            {sortField === 'name' && (
              sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </button>
        </th>
        <th className="pb-2 text-left font-medium text-sm">Category</th>
        <th className="pb-2 text-left font-medium text-sm">
          <button 
            className="flex items-center focus:outline-none" 
            onClick={() => handleSort('price')}
          >
            Price
            {sortField === 'price' && (
              sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </button>
        </th>
        <th className="pb-2 text-left font-medium text-sm">
          <button 
            className="flex items-center focus:outline-none" 
            onClick={() => handleSort('stock')}
          >
            Stock
            {sortField === 'stock' && (
              sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </button>
        </th>
        <th className="pb-2 text-left font-medium text-sm">Status</th>
        <th className="pb-2 text-right font-medium text-sm">Actions</th>
      </tr>
    </thead>
  );
};
