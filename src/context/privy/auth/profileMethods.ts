import { User, UserRole } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';

// Update user profile
export async function updateProfile(
  user: User | null,
  updates: Record<string, any>,
  setUser: (user: User | null) => void,
  toast: any
) {
  try {
    if (!user) throw new Error('No user logged in');
    
    // For demo users
    const demoUserData = localStorage.getItem('defi_store_user');
    if (demoUserData) {
      const demoUser = JSON.parse(demoUserData);
      const updatedUser = { ...demoUser, ...updates };
      
      // Update local storage
      localStorage.setItem('defi_store_user', JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
      
      return { success: true, data: updatedUser };
    }
    
    // Update in Supabase
    const { data, error } = await supabase
      .from('store_users')
      .update(updates)
      .eq('id', user.id)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    
    if (data) {
      const updatedUser: User = {
        id: data.id,
        email: data.email,
        name: data.name || data.email.split('@')[0],
        role: data.role as UserRole,
        avatar: data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || data.email)}&background=random`,
        managedBy: data.managed_by
      };
      
      setUser(updatedUser);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
      
      return { success: true, data: updatedUser };
    } else {
      // If no data returned, keep the current user
      toast({
        title: 'Profile update note',
        description: 'No changes were applied',
      });
      return { success: true, data: user };
    }
  } catch (error: any) {
    console.error('Update profile error:', error);
    toast({
      title: 'Update failed',
      description: error.message || 'Failed to update profile',
      variant: 'destructive',
    });
    return { success: false, error };
  }
}
