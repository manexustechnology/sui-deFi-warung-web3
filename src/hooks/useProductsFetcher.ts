
import { useState, useEffect } from 'react';
import { Product, ExtendedProduct } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { fetchWithFallback } from '@/utils/databaseHelpers';
import { demoProducts } from '@/data/demoData';
import { 
  formatProductData, 
  extractUniqueCategories,
  getFormattedDemoProducts
} from '@/utils/productUtils';

export const useProductsFetcher = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        
        // Use the fetchWithFallback helper with the complete extended product type
        const result = await fetchWithFallback<ExtendedProduct>(
          'products',
          demoProducts as any,
          {
            orderBy: { name: 'desc' },
            where: { status: 'active' }
          }
        );
        
        // Check if we're using demo data
        setIsDemo(result.isDemo);
        
        if (result.data) {
          const formattedProducts = result.data.map(formatProductData);
          setAllProducts(formattedProducts);
          
          // Extract unique categories
          const uniqueCategories = extractUniqueCategories(result.data);
          setCategories(uniqueCategories);
        }
      } catch (error: any) {
        console.error('Error fetching products:', error);
        setErrorMessage(error.message || 'Unknown error');
        
        // Use demo data as fallback
        const formattedDemoProducts = getFormattedDemoProducts();
        setAllProducts(formattedDemoProducts);
        
        // Extract unique categories from demo data
        const uniqueDemoCategories = [...new Set(demoProducts.map(product => product.category))];
        setCategories(uniqueDemoCategories);
        setIsDemo(true);
        
        toast({
          title: 'Database Connection Error',
          description: 'Failed to load products from database. Using demo data instead.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  return {
    allProducts,
    categories,
    isLoading,
    isDemo,
    errorMessage
  };
};
