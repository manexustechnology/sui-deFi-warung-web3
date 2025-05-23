
import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/auth';
import { handlePrivyAuthentication } from './userAuthentication';
import { loadManagedUsers } from './userAuthentication';

export function useLoadUserData() {
  const { ready, authenticated, user: privyUser } = usePrivy();
  const [user, setUser] = useState<User | null>(null);
  const [userLoadError, setUserLoadError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();

  // Load user data on auth change
  useEffect(() => {
    const loadUserData = async () => {
      if (!ready) return;
      
      setIsLoading(true);
      setUserLoadError(false);
      
      // Check if there's user data in localStorage (for demo users)
      const localUser = localStorage.getItem('defi_store_user');
      if (localUser) {
        try {
          const userData = JSON.parse(localUser);
          setUser(userData);
          setIsLoading(false);
          return;
        } catch (error) {
          console.error("Error parsing local user data:", error);
          localStorage.removeItem('defi_store_user');
        }
      }

      // Handle Privy authentication
      if (authenticated && privyUser) {
        try {
          const userData = await handlePrivyAuthentication(privyUser, toast);
          if (userData) {
            setUser(userData);
          } else {
            setUserLoadError(true);
          }
        } catch (error) {
          console.error("Error in authentication process:", error);
          setUserLoadError(true);
        }
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    };
    
    loadUserData();
  }, [ready, authenticated, privyUser, toast]);
  
  // Load users for admin - only when user is loaded and is admin
  useEffect(() => {
    const fetchUsers = async () => {
      const managedUsers = await loadManagedUsers(user, toast);
      setUsers(managedUsers);
    };
    
    if (user) {
      fetchUsers();
    }
  }, [user, toast]);

  // For debugging
  useEffect(() => {
    if (user) {
      console.log("Current authenticated user:", user);
    }
  }, [user]);

  return { 
    user, 
    setUser, 
    userLoadError, 
    isLoading, 
    setIsLoading,
    users,
    setUsers
  };
}
