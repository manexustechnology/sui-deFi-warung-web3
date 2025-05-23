import { Product, ExtendedProduct } from '@/types/product';
import { demoProducts } from '@/data/demoData';

/**
 * Format extended product data to frontend product format
 */
export const formatProductData = (product: ExtendedProduct): Product => ({
  id: product.id,
  name: product.name,
  description: product.description || '',
  price: Number(product.price),
  rating: Number(product.rating || 4.0), // Default rating if not provided
  image: product.image || '',
  category: product.category,
  isNew: product.is_new || false,     // Default false if not provided
  timeLeft: product.time_left || undefined  // Default undefined if not provided
});

/**
 * Extract unique categories from products
 */
export const extractUniqueCategories = (products: ExtendedProduct[]): string[] => {
  return [...new Set(products.map(product => product.category))];
};

/**
 * Filter products based on filter and search criteria
 */
export const filterProducts = (
  allProducts: Product[], 
  activeFilter: string, 
  searchTerm: string,
  sortBy: string
): Product[] => {
  // Filter products based on category
  let filtered = allProducts;
  
  if (activeFilter && activeFilter !== 'all') {
    filtered = allProducts.filter(product => 
      product.category.toLowerCase() === activeFilter.toLowerCase()
    );
  }
  
  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Apply sorting
  switch (sortBy) {
    case 'price-low':
      filtered = [...filtered].sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered = [...filtered].sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
      break;
    default: // 'featured' - no sorting needed
      break;
  }
  
  return filtered;
};

/**
 * Fallback to demo products if needed and format them
 */
export const getFormattedDemoProducts = (): Product[] => {
  return demoProducts.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: Number(product.price),
    rating: 4.0, // Default rating for demo products
    image: product.image || '',
    category: product.category,
    isNew: false, // Default for demo products
    timeLeft: undefined // Default for demo products
  }));
};
