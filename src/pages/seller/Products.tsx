
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SellerLayout from '@/components/layout/SellerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ProductSearchBar } from '@/components/seller/products/ProductSearchBar';
import { ProductActionButtons } from '@/components/seller/products/ProductActionButtons';
import { ProductTableHeader } from '@/components/seller/products/ProductTableHeader';
import { ProductListTable } from '@/components/seller/products/ProductListTable';
import { ProductAddEditDialog } from '@/components/seller/products/ProductAddEditDialog';

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

// Sample products data
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Stylish Watch',
    price: 129.99,
    category: 'Accessories',
    stock: 25,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
    description: 'Elegant watch with leather band',
    dateAdded: new Date('2023-12-01'),
  },
  {
    id: '2',
    name: 'Smartphone Pro',
    price: 899.99,
    category: 'Electronics',
    stock: 5,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2127&auto=format&fit=crop',
    description: 'Latest smartphone with advanced features',
    dateAdded: new Date('2023-11-15'),
  },
  {
    id: '3',
    name: 'Gold Necklace',
    price: 249.99,
    category: 'Jewelry',
    stock: 15,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1974&auto=format&fit=crop',
    description: 'Elegant gold necklace',
    dateAdded: new Date('2023-12-10'),
  },
  {
    id: '4',
    name: 'Leather Wallet',
    price: 79.99,
    category: 'Accessories',
    stock: 3,
    status: 'out-of-stock',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1974&auto=format&fit=crop',
    description: 'Genuine leather wallet',
    dateAdded: new Date('2023-10-20'),
  },
  {
    id: '5',
    name: 'Wireless Earbuds',
    price: 149.99,
    category: 'Electronics',
    stock: 0,
    status: 'out-of-stock',
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=2070&auto=format&fit=crop',
    description: 'Premium wireless earbuds',
    dateAdded: new Date('2023-09-05'),
  },
  {
    id: '6',
    name: 'Diamond Ring',
    price: 1299.99,
    category: 'Jewelry',
    stock: 8,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop',
    description: 'Elegant diamond ring',
    dateAdded: new Date('2023-11-25'),
  },
  {
    id: '7',
    name: 'Designer Sunglasses',
    price: 199.99,
    category: 'Accessories',
    stock: 20,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1980&auto=format&fit=crop',
    description: 'Premium designer sunglasses',
    dateAdded: new Date('2023-10-15'),
  },
  {
    id: '8',
    name: 'Premium Laptop',
    price: 1499.99,
    category: 'Electronics',
    stock: 7,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop',
    description: 'High-performance laptop for professionals',
    dateAdded: new Date('2023-09-30'),
  },
];

const Products = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'out-of-stock' | 'draft'>('all');
  const [sortField, setSortField] = useState<'name' | 'price' | 'stock' | 'dateAdded'>('dateAdded');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  React.useEffect(() => {
    if (!user || user.role !== 'seller') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'seller') {
    return null;
  }

  const handleSort = (field: 'name' | 'price' | 'stock' | 'dateAdded') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Product Deleted",
      description: "The product has been successfully deleted.",
    });
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsAddDialogOpen(true);
  };

  const handleStatusChange = (id: string, newStatus: 'active' | 'draft' | 'out-of-stock') => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, status: newStatus } : product
    ));
    
    toast({
      title: "Status Updated",
      description: `Product status changed to ${newStatus}.`,
    });
  };

  const handleSaveProduct = () => {
    toast({
      title: selectedProduct ? "Product Updated" : "Product Added",
      description: selectedProduct 
        ? "Your product has been updated successfully." 
        : "Your new product has been added successfully.",
    });
    setIsAddDialogOpen(false);
  };

  const sortedProducts = [...products]
    .filter(product => {
      // Apply search filter
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply status filter
      const matchesStatus = activeTab === 'all' || product.status === activeTab;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortField === 'price') {
        return sortDirection === 'asc' 
          ? a.price - b.price 
          : b.price - a.price;
      } else if (sortField === 'stock') {
        return sortDirection === 'asc' 
          ? a.stock - b.stock 
          : b.stock - a.stock;
      } else { // dateAdded
        return sortDirection === 'asc' 
          ? a.dateAdded.getTime() - b.dateAdded.getTime() 
          : b.dateAdded.getTime() - a.dateAdded.getTime();
      }
    });

  return (
    <SellerLayout>
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Products</h1>
            <p className="text-sm text-muted-foreground">Manage your product inventory</p>
          </div>
          <ProductActionButtons onAddProduct={() => {
            setSelectedProduct(null);
            setIsAddDialogOpen(true);
          }} />
        </div>

        <ProductSearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />

        <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as any)} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          </TabsList>

          <Card>
            <CardHeader className="px-6">
              <CardTitle className="text-base font-medium">Product List</CardTitle>
            </CardHeader>
            <CardContent className="px-6">
              <div className="overflow-auto">
                <table className="w-full">
                  <ProductTableHeader 
                    sortField={sortField}
                    sortDirection={sortDirection}
                    handleSort={handleSort}
                  />
                  <tbody>
                    {sortedProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-muted-foreground">
                          No products found. Try adjusting your filters.
                        </td>
                      </tr>
                    ) : (
                      <ProductListTable 
                        products={sortedProducts}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        handleSort={handleSort}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        handleStatusChange={handleStatusChange}
                      />
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pt-4 text-sm text-muted-foreground">
                Showing {sortedProducts.length} of {products.length} products
              </div>
            </CardContent>
          </Card>
        </Tabs>
      </div>

      <ProductAddEditDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        selectedProduct={selectedProduct}
        onSave={handleSaveProduct}
      />
    </SellerLayout>
  );
};

export default Products;
