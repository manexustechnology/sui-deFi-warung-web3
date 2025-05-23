
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'draft' | 'out-of-stock';
  image: string;
  description: string;
  dateAdded: Date;
};

interface ProductAddEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProduct: Product | null;
  onSave: () => void;
}

export const ProductAddEditDialog: React.FC<ProductAddEditDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedProduct,
  onSave
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {selectedProduct ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription>
            {selectedProduct 
              ? 'Update the details of your product' 
              : 'Fill in the details for your new product'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Product Name</label>
            <Input 
              id="name" 
              defaultValue={selectedProduct?.name || ''}
              placeholder="Enter product name"
            />
          </div>
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <label htmlFor="price" className="text-sm font-medium">Price ($)</label>
              <Input 
                id="price" 
                type="number" 
                defaultValue={selectedProduct?.price || ''}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2 flex-1">
              <label htmlFor="stock" className="text-sm font-medium">Stock</label>
              <Input 
                id="stock" 
                type="number" 
                defaultValue={selectedProduct?.stock || ''}
                placeholder="0"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">Category</label>
            <Input 
              id="category" 
              defaultValue={selectedProduct?.category || ''}
              placeholder="Enter category"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Input 
              id="description" 
              defaultValue={selectedProduct?.description || ''}
              placeholder="Enter product description"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={onSave}>
            {selectedProduct ? 'Save Changes' : 'Add Product'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
