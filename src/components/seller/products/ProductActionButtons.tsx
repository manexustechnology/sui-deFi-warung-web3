
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Download, Plus } from 'lucide-react';

interface ProductActionButtonsProps {
  onAddProduct: () => void;
}

export const ProductActionButtons: React.FC<ProductActionButtonsProps> = ({
  onAddProduct
}) => {
  return (
    <div className="flex space-x-2">
      <Button variant="outline">
        <Upload className="mr-2 h-4 w-4" />
        Import
      </Button>
      <Button variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
      <Button onClick={onAddProduct}>
        <Plus className="mr-2 h-4 w-4" />
        Add Product
      </Button>
    </div>
  );
};
