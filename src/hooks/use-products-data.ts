
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchWithFallback } from '@/utils/databaseHelpers';
import { 
  ProductManagement, 
  ProductCreationData, 
  ProductUpdateData,
  ProductsDataResult 
} from '@/types/product-management';
import {
  fetchProductsOperation,
  createProductOperation,
  updateProductOperation
} from '@/utils/product-operations';
import prisma from '@/lib/prisma';

export function useProductsData(): ProductsDataResult {
  const [products, setProducts] = useState<ProductManagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const fetchProducts = async () => {
    await fetchProductsOperation(
      setProducts,
      setIsDemo,
      setErrorMessage,
      setLoading,
      fetchWithFallback,
      toast
    );
  };

  const createProduct = async (product: ProductCreationData) => {
    const result = await createProductOperation(
      product,
      isDemo,
      setProducts,
      currentUser?.id,
      toast
    );
    // Ensure we're returning the properly typed result
    return result as { 
      success: boolean; 
      isDemo: boolean; 
      data?: ProductManagement; 
      error?: string 
    };
  };

  const updateProduct = async (id: string, updates: ProductUpdateData) => {
    return await updateProductOperation(
      id,
      updates,
      isDemo,
      setProducts,
      setIsDemo,
      setErrorMessage,
      prisma,
      toast
    );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    isDemo,
    errorMessage,
    refresh: fetchProducts,
    createProduct,
    updateProduct
  };
}
