
// Logout
export async function logout(
  authenticated: boolean,
  privyLogout: () => Promise<void>,
  setUser: (user: User | null) => void,
  toast: any
) {
  try {
    // Clear local storage for demo users
    localStorage.removeItem('defi_store_user');
    localStorage.removeItem('preferred_role');
    
    // Privy logout
    if (authenticated) {
      await privyLogout();
    }
    
    setUser(null);
    
    toast({
      title: 'Signed out successfully',
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Logout error:', error);
    toast({
      title: 'Failed to sign out',
      description: error.message || 'An error occurred while signing out',
      variant: 'destructive',
    });
    return { success: false, error };
  }
}

// Need to import User type
import { User } from '@/types/auth';
