
import React, { ReactNode } from 'react';
import { PrivyProvider as PrivyClientProvider } from '@privy-io/react-auth';
import { PrivyAuthInnerProvider } from './PrivyAuthProvider';
import { PRIVY_APP_ID, PRIVY_CLIENT_ID } from './constants';

interface PrivyProviderProps {
  children: ReactNode;
}

export const PrivyAuthProvider = ({ children }: PrivyProviderProps) => {
  return (
    <PrivyClientProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <PrivyAuthInnerProvider>{children}</PrivyAuthInnerProvider>
    </PrivyClientProvider>
  );
};
