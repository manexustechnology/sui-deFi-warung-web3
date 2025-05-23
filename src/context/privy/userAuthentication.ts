
import { useToast } from '@/hooks/use-toast';
import { User, UserRole } from '@/types/auth';
import { loadUserDataFromSupabase, fetchManagedUsers } from './userManagement';
import { demoUsers } from './constants';

// Handle Privy authentication
export async function handlePrivyAuthentication(
  privyUser: any,
  toast: any,
): Promise<User | null> {
  try {
    // Get user's email from Privy
    const email = privyUser.email?.address;
    
    if (email) {
      try {
        // Get selected tab role from localStorage - this takes priority
        const selectedTabRole = localStorage.getItem('selected_tab_role');
        
        // Determine role from selected tab (highest priority)
        const preferredRole: UserRole = (selectedTabRole === 'seller') 
                                        ? 'admin' 
                                        : 'buyer';
        
        console.log("Using selected tab role:", preferredRole);
        
        // Try to load user data from database but don't rely on its role
        try {
          const userData = await loadUserDataFromSupabase(email, toast);
          
          if (userData) {
            console.log("User data loaded from database:", userData);
            
            // Override the database role with the selected tab role
            userData.role = preferredRole;
            
            return userData;
          }
        } catch (error) {
          console.log("Failed to load user data from database, using fallback");
          // Continue to fallback - don't return or throw here
        }
        
        // Create a default user with the preferred role from tab selection
        const defaultUser: User = {
          id: privyUser.id,
          email: email,
          name: email.split('@')[0],
          role: preferredRole,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=random`
        };
        
        toast({
          title: `Logged in as ${preferredRole === 'admin' ? 'seller' : 'buyer'}`,
          description: `Welcome, ${defaultUser.name}!`,
        });
        
        return defaultUser;
        
      } catch (error) {
        console.error("Error in authentication process:", error);
        
        // Get selected tab role from localStorage as fallback
        const selectedTabRole = localStorage.getItem('selected_tab_role');
        
        // Determine role from selected tab
        const preferredRole: UserRole = (selectedTabRole === 'seller') 
                                      ? 'admin' 
                                      : 'buyer';
        
        // Create a fallback user to allow access
        const fallbackUser: User = {
          id: privyUser.id,
          email: email,
          name: email.split('@')[0],
          role: preferredRole,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=random`
        };
        
        toast({
          title: 'Using fallback profile',
          description: `You're logged in as ${preferredRole === 'admin' ? 'seller' : 'buyer'}`,
          variant: 'default',
        });
        
        return fallbackUser;
      }
    } else {
      console.error("No email found in Privy user");
      return null;
    }
  } catch (error) {
    console.error("Error in authentication process:", error);
    
    toast({
      title: 'Authentication error',
      description: 'An error occurred but you can continue using the app',
      variant: 'destructive',
    });
    
    return null;
  }
}

// Handle demo user login
export function handleDemoUserLogin(email: string, demoUser: User): User {
  localStorage.setItem('defi_store_user', JSON.stringify(demoUser));
  return demoUser;
}

// Load users for admin role
export async function loadManagedUsers(
  user: User | null,
  toast: any,
): Promise<User[]> {
  if (!user || user.role !== 'admin') {
    return [];
  }
  
  try {
    const managedUsers = await fetchManagedUsers(user.id);
    return managedUsers;
  } catch (error) {
    console.error("Error fetching managed users:", error);
    // Don't block the UI, just show a toast
    toast({
      title: 'Error loading users',
      description: 'Could not load managed users',
      variant: 'destructive',
    });
    return [];
  }
}
