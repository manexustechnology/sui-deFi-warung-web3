
import { ReactNode } from 'react';

// Define wallet types
export type WalletType = 'Slush' | 'Martian' | 'Sui' | 'Ethos' | null;

export interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  balance: number | null;
  walletType: WalletType;
  connect: (walletType: WalletType) => Promise<void>;
  disconnect: () => void;
  isLoading: boolean;
}

export interface WalletProviderProps {
  children: ReactNode;
}

export interface InnerWalletProviderProps {
  children: ReactNode;
}
