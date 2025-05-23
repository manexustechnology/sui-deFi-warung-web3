
import React, { useState, useEffect } from 'react';
import { ArrowRight, Carrot } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../ui/ProductCard';
import { Product } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Vegetable and fruit products
  const groceryProducts: Product[] = [
    {
      id: "1",
      name: "Fresh Organic Tomatoes",
      description: "Locally sourced, pesticide-free tomatoes. Perfect for salads and cooking.",
      price: 2.5,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Vegetables",
      isNew: true
    },
    {
      id: "2",
      name: "Red Onions",
      description: "Sweet and flavorful red onions from local farmers.",
      price: 1.8,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Vegetables"
    },
    {
      id: "3",
      name: "Organic Bananas",
      description: "Sweet and nutritious bananas grown without harmful pesticides.",
      price: 3.2,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Fruits",
      timeLeft: "2 days"
    },
    {
      id: "4",
      name: "Fresh Oranges",
      description: "Juicy and sweet oranges, rich in vitamin C and antioxidants.",
      price: 4.0,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1611080626919-7cf5a9041525?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Fruits"
    }
  ];

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('rating', { ascending: false })
          .limit(4);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const formattedProducts = data.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description || '',
            price: Number(product.price),
            rating: Number(product.rating) || 4.0,
            image: product.image || '',
            category: product.category,
            isNew: product.is_new || false,
            timeLeft: product.time_left || undefined
          }));
          setFeaturedProducts(formattedProducts);
        } else {
          // Use local grocery products if no data from Supabase
          setFeaturedProducts(groceryProducts);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setFeaturedProducts(groceryProducts);
        toast({
          title: t('products.error.title'),
          description: t('products.error.description'),
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [toast, t]);

  return (
    <section className="section-padding bg-gradient-to-b from-transparent to-green-50/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <span className="tag bg-green-100 text-green-800 mb-3">{t('products.featuredTag')}</span>
            <h2 className="text-3xl font-bold">{t('products.title')}</h2>
          </div>
          <Link to="/products" className="mt-4 md:mt-0 group flex items-center text-green-600 font-medium hover-scale">
            {t('products.viewAll')}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="glass-card h-80 animate-pulse">
                <div className="bg-gray-200 h-44 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <Carrot className="h-16 w-16 mx-auto text-green-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">{t('products.empty.title')}</h3>
              <p className="text-muted-foreground">{t('products.empty.description')}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
