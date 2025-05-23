
import { useEffect, useState } from 'react';
import { demoDashboardStats, demoSalesData, demoRecommendations } from '@/data/demoData';
import { fetchWithFallback } from '@/utils/databaseHelpers';
import prisma from '@/lib/prisma';

export type DashboardStat = {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  newCustomers: number;
  customersChange: number;
  activeProducts: number;
  newProducts: number;
};

export type SalesData = {
  name: string;
  total: number;
};

export type Recommendation = {
  title: string;
  description: string;
  icon: string;
};

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStat>(demoDashboardStats);
  const [salesData, setSalesData] = useState<SalesData[]>(demoSalesData);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(demoRecommendations);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const fetchDashboardData = async () => {
    setLoading(true);
    setErrorMessage(null);
    
    try {
      // Attempt to get orders for revenue calculation
      const ordersResult = await fetchWithFallback('orders', [], {
        select: {
          id: true,
          total: true,
          created_at: true,
        }
      });
      
      // Get new users count (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Get active products
      const productsResult = await fetchWithFallback('products', [], {
        where: {
          status: 'active',
        }
      });
      
      // Get new products (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const newProductsResult = await fetchWithFallback('products', [], {
        where: {
          created_at: {
            gte: sevenDaysAgo.toISOString(),
          }
        }
      });
      
      // Get users data
      const usersResult = await fetchWithFallback('store_users', [], {
        where: {
          created_at: {
            gte: thirtyDaysAgo.toISOString(),
          },
          role: 'buyer',
        }
      });
      
      // Check if any call returned demo data
      const usingDemoData = ordersResult.isDemo || 
        productsResult.isDemo || 
        newProductsResult.isDemo || 
        usersResult.isDemo;
      
      setIsDemo(usingDemoData);
      
      if (!usingDemoData) {
        // Calculate total revenue
        const totalRevenue = ordersResult.data.reduce((sum: number, order: any) => {
          return sum + Number(order.total);
        }, 0);
        
        // Build stats object
        const statsData: DashboardStat = {
          totalRevenue,
          revenueChange: 5.2, // Hardcoded for demo, would calculate in real app
          totalOrders: ordersResult.data.length,
          ordersChange: 3.8, // Hardcoded for demo
          newCustomers: usersResult.data.length,
          customersChange: 7.4, // Hardcoded for demo
          activeProducts: productsResult.data.length,
          newProducts: newProductsResult.data.length
        };
        
        setStats(statsData);
        
        // For sales data, we'll use a mock for now, but in a real app
        // you would query this from a dedicated table or calculation
        setSalesData(demoSalesData);
        
        // Recommendations are static for now
        setRecommendations(demoRecommendations);
      } else {
        // If using demo data
        setStats(demoDashboardStats);
        setSalesData(demoSalesData);
        setRecommendations(demoRecommendations);
      }
      
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      setErrorMessage(error.message || "Unknown error");
      setIsDemo(true);
      setStats(demoDashboardStats);
      setSalesData(demoSalesData);
      setRecommendations(demoRecommendations);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDashboardData();
    
    // Optional: Set up a refresh interval
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000); // Refresh every 5 minutes
    
    return () => clearInterval(interval);
  }, []);
  
  return {
    stats,
    salesData,
    recommendations,
    loading,
    isDemo,
    errorMessage,
    refresh: fetchDashboardData
  };
};
