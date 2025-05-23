
import { useState, useEffect } from 'react';
import { demoOrders } from '@/data/demoData';
import { fetchWithFallback, submitWithFallback } from '@/utils/databaseHelpers';
import { useToast } from './use-toast';
import prisma from '@/lib/prisma';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export type Order = {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: number;
};

export function useOrdersData() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await fetchWithFallback<any>(
        'orders', 
        demoOrders,
        { 
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            user_id: true,
            total: true,
            status: true,
            created_at: true,
            user: {
              select: {
                name: true
              }
            },
            items: {
              select: {
                id: true
              }
            }
          }
        }
      );

      if (!result.isDemo) {
        // Transform the data from database format to our Order type
        const transformedOrders = result.data.map((order: any) => {
          return {
            id: order.id,
            customer: order.user?.name || 'Unknown Customer',
            date: new Date(order.created_at).toISOString().split('T')[0],
            total: parseFloat(order.total),
            status: (order.status || 'pending') as OrderStatus,
            items: order.items?.length || 0
          };
        });

        setOrders(transformedOrders);
        setIsDemo(false);
      } else {
        // Convert demo orders to match our Order type with proper status typing
        const typedDemoOrders: Order[] = result.data.map((order: any) => ({
          ...order,
          status: order.status as OrderStatus
        }));
        
        setOrders(typedDemoOrders);
        setIsDemo(true);
      }
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      setErrorMessage(error.message || "Unknown error");
      
      // Convert demo orders to match our Order type with proper status typing
      const typedDemoOrders: Order[] = demoOrders.map((order: any) => ({
        ...order,
        status: order.status as OrderStatus
      }));
      
      setOrders(typedDemoOrders);
      setIsDemo(true);
      
      toast({
        title: "Database Error",
        description: "Failed to load orders. Using demo data instead.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    if (isDemo) {
      // Update in the local state if we're in demo mode
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      );
      
      toast({
        title: "Demo Mode",
        description: "Currently displaying demo data - status updated in memory only",
      });
      
      return { success: true, isDemo: true };
    }

    try {
      // For real database updates
      await prisma.order.update({
        where: { id: orderId },
        data: { status }
      });

      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      );

      return { success: true, isDemo: false };
    } catch (error: any) {
      console.error("Error updating order status:", error);
      setErrorMessage(error.message || "Unknown error");
      
      // Fallback to updating local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      );
      
      toast({
        title: "Database Error",
        description: "Failed to update order status, falling back to demo mode",
        variant: "destructive",
      });
      
      setIsDemo(true);
      return { success: false, isDemo: true, error: String(error) };
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    isDemo,
    errorMessage,
    refresh: fetchOrders,
    updateOrderStatus
  };
}
