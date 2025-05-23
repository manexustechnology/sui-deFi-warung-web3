import { User, UserRole } from '@/types/auth';

export interface PrivyAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userLoadError: Error | null;
  user: User | null;
  login: (email: string, password: string, role?: string) => Promise<any>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, role?: string) => Promise<any>;
  updateProfile: (updates: Record<string, any>) => Promise<boolean>;
  getUserDetails: () => User | null;
  getUsers: () => User[];
  createUser: (name: string, email: string, role: 'cashier' | 'inventory') => Promise<void>;
}

export interface PrivyProviderProps {
  children: React.ReactNode;
}

export const PRIVY_APP_ID = "clt37qg280016l108rd1v8r3w";
