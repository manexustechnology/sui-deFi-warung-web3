
import { User, UserRole } from '@/types/auth';
import { handlePrivyAuthentication, handleDemoUserLogin } from '../userAuthentication';
import { demoUsers } from '../constants';

// Email login with support for demo users
export async function loginWithEmail(
  email: string, 
  password: string, 
  role: string | undefined,
  privyLogin: () => Promise<void>,
  setUser: (user: User | null) => void,
  setIsLoading: (loading: boolean) => void,
  toast: any
) {
  try {
    setIsLoading(true);
    
    // Ensure role is valid, default to buyer if not specified
    const selectedRole = (role === 'seller' || role === 'buyer') ? role : 'buyer';
    
    // Demo user login logic
    if ((email === 'demoseller@gmail.com' && password === 'demoseller123') || 
        (email === 'demobuyer@gmail.com' && password === 'demobuyer123')) {
      
      const demoUser = demoUsers[email as keyof typeof demoUsers];
      
      // Override role based on selected tab regardless of demo user defaults
      demoUser.role = selectedRole === 'seller' ? 'admin' : 'buyer';
      
      const user = handleDemoUserLogin(email, demoUser);
      setUser(user);
      
      toast({
        title: 'Signed in successfully',
        description: `Welcome back, ${demoUser.name}`,
      });
      
      return { success: true, data: { user: demoUser }, selectedRole };
    }
    
    // Store selected role in localStorage for later
    localStorage.setItem('preferred_role', selectedRole);
    localStorage.setItem('selected_tab_role', selectedRole);
    
    // Regular Privy login - this will trigger the auth state change effect
    try {
      await privyLogin();
      return { success: true, selectedRole };
    } catch (error) {
      console.error("Privy login error:", error);
      throw error;
    }
    
  } catch (error: any) {
    console.error('Login error:', error);
    toast({
      title: 'Login failed',
      description: error.message || 'Invalid email or password',
      variant: 'destructive',
    });
    return { success: false, error };
  } finally {
    setIsLoading(false);
  }
}
