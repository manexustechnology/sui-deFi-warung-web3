
export type ProductStatus = 'active' | 'inactive' | 'out_of_stock';

export interface ProductManagement {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category: string;
  image?: string | null;
  stock: number;
  barcode?: string | null;
  status: ProductStatus;
  rating?: number | null;
  is_new?: boolean | null;
  time_left?: string | null;
  seller_id?: string;
}

export interface ProductCreationData extends Omit<ProductManagement, 'id'> {}

export interface ProductUpdateData extends Partial<ProductManagement> {}

export interface ProductsDataResult {
  products: ProductManagement[];
  loading: boolean;
  isDemo: boolean;
  errorMessage: string | null;
  refresh: () => Promise<void>;
  createProduct: (product: ProductCreationData) => Promise<{
    success: boolean;
    isDemo: boolean;
    data?: ProductManagement;
    error?: string;
  }>;
  updateProduct: (id: string, updates: ProductUpdateData) => Promise<{
    success: boolean;
    isDemo: boolean;
    error?: string;
  }>;
}
