
import React from 'react';
import InnerWalletProvider from './InnerWalletProvider';
import { WalletProviderProps } from './types';

// This is the simplified provider that removes dependency on @mysten/wallet-adapter-react
export const WalletProvider = ({ children }: WalletProviderProps) => {
  return (
    <InnerWalletProvider>
      {children}
    </InnerWalletProvider>
  );
};
