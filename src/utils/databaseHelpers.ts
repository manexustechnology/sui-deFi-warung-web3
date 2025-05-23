
import prisma from '@/lib/prisma';
import { toast } from '@/hooks/use-toast';
import { demoProducts, demoStoreUsers, demoOrders } from '@/data/demoData';

/**
 * Generic function to fetch data from PostgreSQL with fallback to demo data
 * @param entity The database entity to fetch data from
 * @param demoData The demo data to return if database connection fails
 * @param queryOptions Additional query options (select, order, filter, etc.)
 */
export async function fetchWithFallback<T>(
  entity: 'products' | 'store_users' | 'orders' | 'order_items' | 'profiles' | 'carts' | 'cart_items',
  demoData: T[],
  queryOptions?: {
    select?: any;
    orderBy?: { [key: string]: 'asc' | 'desc' };
    limit?: number;
    where?: any;
  }
): Promise<{ data: T[]; isDemo: boolean }> {
  try {
    // Build the query based on entity
    let data;

    const queryArgs: any = {
      where: queryOptions?.where || {},
      orderBy: queryOptions?.orderBy,
      take: queryOptions?.limit,
    };

    if (queryOptions?.select) {
      queryArgs.select = queryOptions.select;
    }

    // Execute the query using Prisma client
    switch (entity) {
      case 'products':
        data = await prisma.product.findMany(queryArgs);
        break;
      case 'store_users':
        data = await prisma.storeUser.findMany(queryArgs);
        break;
      case 'orders':
        data = await prisma.order.findMany(queryArgs);
        break;
      case 'order_items':
        data = await prisma.orderItem.findMany(queryArgs);
        break;
      case 'profiles':
        data = await prisma.profile.findMany(queryArgs);
        break;
      case 'carts':
        data = await prisma.cart.findMany(queryArgs);
        break;
      case 'cart_items':
        data = await prisma.cartItem.findMany(queryArgs);
        break;
      default:
        throw new Error(`Unsupported entity: ${entity}`);
    }

    return { data: data as T[], isDemo: false };
  } catch (error) {
    console.error(`Error fetching from ${entity}:`, error);
    toast({
      title: "Database Connection Issue",
      description: "Switching to demo data mode. Data changes won't be saved.",
      variant: "destructive",
    });
    return { data: demoData, isDemo: true };
  }
}

/**
 * Generic function to submit data to PostgreSQL with fallback
 * @param entity The database entity to insert data to
 * @param data The data to insert
 * @param onSuccess Callback function to execute on successful insertion
 * @param fallbackAction Action to perform when database connection fails
 */
export async function submitWithFallback(
  entity: 'products' | 'store_users' | 'orders' | 'order_items' | 'profiles' | 'carts' | 'cart_items',
  data: any,
  onSuccess?: (data: any) => void,
  fallbackAction?: () => void
): Promise<{ success: boolean; isDemo: boolean; data?: any; error?: string }> {
  try {
    let insertedData;

    // Execute the query using Prisma client
    switch (entity) {
      case 'products':
        insertedData = await prisma.product.create({ data });
        break;
      case 'store_users':
        insertedData = await prisma.storeUser.create({ data });
        break;
      case 'orders':
        insertedData = await prisma.order.create({ data });
        break;
      case 'order_items':
        insertedData = await prisma.orderItem.create({ data });
        break;
      case 'profiles':
        insertedData = await prisma.profile.create({ data });
        break;
      case 'carts':
        insertedData = await prisma.cart.create({ data });
        break;
      case 'cart_items':
        insertedData = await prisma.cartItem.create({ data });
        break;
      default:
        throw new Error(`Unsupported entity: ${entity}`);
    }

    if (onSuccess && insertedData) {
      onSuccess(insertedData);
    }

    return { success: true, isDemo: false, data: insertedData };
  } catch (error: any) {
    console.error(`Failed to insert into ${entity}:`, error);
    toast({
      title: "Database Connection Issue",
      description: "Operating in demo mode - changes won't be saved",
      variant: "destructive",
    });

    if (fallbackAction) {
      fallbackAction();
    }

    return { success: false, isDemo: true, error: error?.message || 'Unknown error' };
  }
}

// Helper function to convert filters from the old format to Prisma where format
export function convertFiltersToPrismaWhere(filters: { column: string; value: any; operator?: string }[]): any {
  const where: any = {};

  filters.forEach(filter => {
    const { column, value, operator = 'eq' } = filter;

    switch (operator) {
      case 'eq':
        where[column] = value;
        break;
      case 'gt':
        where[column] = { gt: value };
        break;
      case 'lt':
        where[column] = { lt: value };
        break;
      case 'gte':
        where[column] = { gte: value };
        break;
      case 'lte':
        where[column] = { lte: value };
        break;
      case 'like':
        where[column] = { contains: value.replace(/%/g, '') };
        break;
      default:
        where[column] = value;
    }
  });

  return where;
}
