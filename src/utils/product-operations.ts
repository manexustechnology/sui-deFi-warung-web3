import { demoProducts } from '@/data/demoData';
import { submitWithFallback } from '@/utils/databaseHelpers';
import { ProductManagement, ProductCreationData, ProductUpdateData } from '@/types/product-management';
import { useToast } from '@/hooks/use-toast';

/**
 * Create a new product (either in demo mode or real database)
 */
export async function createProductOperation(
  product: ProductCreationData,
  isDemo: boolean,
  setProducts: React.Dispatch<React.SetStateAction<ProductManagement[]>>,
  userId?: string,
  toast = useToast().toast
) {
  if (isDemo) {
    // Create a demo product with a generated ID
    const newProduct = {
      id: `demo-${Date.now()}`,
      ...product
    } as ProductManagement;

    setProducts(prevProducts => [...prevProducts, newProduct]);
    
    toast({
      title: "Demo Mode",
      description: "Product created in demo mode - changes won't be saved to database",
    });
    
    return { success: true, isDemo: true, data: newProduct };
  }

  const newProduct = {
    ...product,
    seller_id: userId
  };

  // We'll properly type the submitWithFallback function to resolve the TS error
  const result = await submitWithFallback(
    'products',
    newProduct,
    (data) => {
      // On success, add to the products list
      setProducts(prevProducts => [...prevProducts, data as ProductManagement]);
      
      toast({
        title: "Product Created",
        description: `${product.name} has been successfully added`,
      });
    },
    () => {
      // Fallback action for demo mode
      const demoProduct = {
        id: `demo-${Date.now()}`,
        ...product
      } as ProductManagement;
      setProducts(prevProducts => [...prevProducts, demoProduct]);
      
      toast({
        title: "Demo Mode",
        description: "Product created in demo mode - changes won't be saved to database",
      });
    }
  );

  return result as { success: boolean; isDemo: boolean; data?: ProductManagement; error?: string };
}

/**
 * Update an existing product (either in demo mode or real database)
 */
export async function updateProductOperation(
  id: string,
  updates: ProductUpdateData,
  isDemo: boolean,
  setProducts: React.Dispatch<React.SetStateAction<ProductManagement[]>>,
  setIsDemo: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
  prismaClient: any,
  toast = useToast().toast
) {
  if (isDemo) {
    // Update in the local state if we're in demo mode
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === id ? { ...product, ...updates } : product
      )
    );
    
    toast({
      title: "Demo Mode",
      description: "Product updated in demo mode - changes won't be saved to database",
    });
    
    return { success: true, isDemo: true };
  }

  try {
    // For real database updates
    await prismaClient.product.update({
      where: { id },
      data: updates
    });

    // Update local state
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === id ? { ...product, ...updates } : product
      )
    );
    
    toast({
      title: "Product Updated",
      description: `Product has been successfully updated`,
    });

    return { success: true, isDemo: false };
  } catch (error: any) {
    console.error("Error updating product:", error);
    setErrorMessage(error.message || "Unknown error");
    
    // Fallback to updating local state
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === id ? { ...product, ...updates } : product
      )
    );
    setIsDemo(true);
    
    toast({
      title: "Database Error",
      description: "Failed to update product, operating in demo mode",
      variant: "destructive",
    });
    
    return { success: false, isDemo: true, error: String(error) };
  }
}

/**
 * Fetch products with fallback to demo data
 */
export async function fetchProductsOperation(
  setProducts: React.Dispatch<React.SetStateAction<ProductManagement[]>>,
  setIsDemo: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  fetchWithFallback: any,
  toast = useToast().toast
) {
  setLoading(true);
  setErrorMessage(null);

  try {
    const result = await fetchWithFallback(
      'products', 
      demoProducts as ProductManagement[],
      { 
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          category: true,
          image: true,
          stock: true,
          barcode: true,
          status: true,
          rating: true,
          is_new: true,
          time_left: true
        },
        orderBy: { name: 'asc' }
      }
    );

    setProducts(result.data);
    setIsDemo(result.isDemo);
  } catch (error: any) {
    console.error("Error fetching products:", error);
    setErrorMessage(error.message || "Unknown error");
    setProducts(demoProducts as ProductManagement[]);
    setIsDemo(true);
    
    toast({
      title: "Database Error",
      description: "Failed to load products. Using demo data instead.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
}
