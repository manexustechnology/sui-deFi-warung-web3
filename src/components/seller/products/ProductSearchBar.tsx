
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

interface ProductSearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const ProductSearchBar: React.FC<ProductSearchBarProps> = ({
  searchTerm,
  setSearchTerm
}) => {
  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button variant="outline" size="icon">
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
};
