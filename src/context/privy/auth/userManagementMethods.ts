
import { User } from '@/types/auth';
import { createStoreUser } from '../userManagement';

// Create a new user
export async function createUserAccount(
  name: string, 
  email: string, 
  role: 'cashier' | 'inventory',
  currentUser: User | null,
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  toast: any
): Promise<void> {
  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'seller')) {
    toast({
      title: 'User creation failed',
      description: 'Unauthorized',
      variant: 'destructive',
    });
    return Promise.resolve(); // Return a resolved promise
  }
  
  try {
    const newUser = await createStoreUser(name, email, role, currentUser.id, toast);
    if (newUser) {
      setUsers(prev => [...prev, newUser]);
    }
    return Promise.resolve(); // Return a resolved promise
  } catch (error) {
    console.error("Error in createUserAccount:", error);
    toast({
      title: 'User creation failed',
      description: 'An error occurred while creating the user',
      variant: 'destructive',
    });
    return Promise.resolve(); // Return a resolved promise even on error
  }
}
