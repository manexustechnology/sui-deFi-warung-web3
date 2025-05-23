
import React from 'react';
import { usePrivyAuth, PrivyAuthInnerProvider } from '@/context/PrivyContext';
import { AuthContextType } from './types';
import { createContext } from 'react';

// Create AuthContext as a wrapper around PrivyContext for backward compatibility
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Wrapper component that passes PrivyAuth values to AuthContext
const AuthProviderInner = ({ children }: { children: React.ReactNode }) => {
  const privyAuth = usePrivyAuth();
  
  // Map Privy auth methods to our AuthContext interface
  const authContextValue: AuthContextType = {
    user: privyAuth.user as any,
    session: null, // No longer using Supabase sessions
    isLoading: privyAuth.isLoading,
    userProfile: privyAuth.user,
    userLoadError: privyAuth.userLoadError,
    
    // Main auth methods
    signUp: (email, password, metadata) => privyAuth.signUp(email, password, metadata as any),
    signIn: (email, password, metadata) => privyAuth.login(email, password, metadata as any),
    signInWithOAuth: async () => ({ success: false, error: 'OAuth not supported' }),
    signOut: privyAuth.logout,
    updateProfile: privyAuth.updateProfile,
    
    // User management
    getUserDetails: privyAuth.getUserDetails,
    getUsers: privyAuth.getUsers,
    createUser: async (name, email, role) => {
      await privyAuth.createUser(name, email, role);
    },
    
    // Legacy alias methods
    login: (email, password, metadata) => privyAuth.login(email, password, metadata as any),
    loginWithGoogle: async () => ({ success: false, error: 'Google login not supported' }),
    logout: privyAuth.logout
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Export new AuthProvider that wraps PrivyAuthInnerProvider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyAuthInnerProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </PrivyAuthInnerProvider>
  );
};

export default AuthProvider;
