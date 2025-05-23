
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

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

interface ProductListTableProps {
  products: Product[];
  sortField: 'name' | 'price' | 'stock' | 'dateAdded';
  sortDirection: 'asc' | 'desc';
  handleSort: (field: 'name' | 'price' | 'stock' | 'dateAdded') => void;
  handleEdit: (product: Product) => void;
  handleDelete: (id: string) => void;
  handleStatusChange: (id: string, status: 'active' | 'draft' | 'out-of-stock') => void;
}

export const ProductListTable: React.FC<ProductListTableProps> = ({
  products,
  sortField,
  sortDirection,
  handleSort,
  handleEdit,
  handleDelete,
  handleStatusChange
}) => {
  if (products.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="py-10 text-center text-muted-foreground">
          No products found. Try adjusting your filters.
        </td>
      </tr>
    );
  }

  return (
    <>
      {products.map((product) => (
        <tr key={product.id} className="border-b">
          <td className="py-3">
            <div className="flex items-center space-x-3">
              <img 
                src={product.image} 
                alt={product.name} 
                className="h-10 w-10 rounded-md object-cover"
              />
              <div>
                <div className="font-medium">{product.name}</div>
                <div className="text-xs text-muted-foreground">
                  ID: {product.id}
                </div>
              </div>
            </div>
          </td>
          <td className="py-3">
            <Badge variant="outline">{product.category}</Badge>
          </td>
          <td className="py-3">${product.price.toFixed(2)}</td>
          <td className="py-3">
            <div className="flex items-center">
              <span
                className={`mr-2 h-2 w-2 rounded-full ${
                  product.stock === 0
                    ? 'bg-red-500'
                    : product.stock < 5
                    ? 'bg-amber-500'
                    : 'bg-green-500'
                }`}
              />
              {product.stock} in stock
            </div>
          </td>
          <td className="py-3">
            <Badge
              className={`${
                product.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : product.status === 'out-of-stock'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
              variant="outline"
            >
              {product.status}
            </Badge>
          </td>
          <td className="py-3 text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(product)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(product.id, 'active')}>
                  Set as Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(product.id, 'out-of-stock')}>
                  Mark Out of Stock
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(product.id, 'draft')}>
                  Move to Draft
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </td>
        </tr>
      ))}
    </>
  );
};
