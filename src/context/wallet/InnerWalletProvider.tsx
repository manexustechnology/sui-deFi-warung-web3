
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WalletContext } from './useWalletContext';
import { WalletType, InnerWalletProviderProps } from './types';

// Wallet installation links
const WALLET_URLS = {
  Slush: 'https://slush.app/',
  Martian: 'https://martianwallet.xyz/',
  Sui: 'https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil',
  Ethos: 'https://chrome.google.com/webstore/detail/ethos-sui-wallet/mcbigmjiafegjnnogedioegffbooigli'
};

// This provider implements wallet functionality with proper extension detection
const InnerWalletProvider = ({ children }: InnerWalletProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [walletType, setWalletType] = useState<WalletType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Effect to check local storage for saved wallet type on initial load
  useEffect(() => {
    const savedWalletType = localStorage.getItem('walletType') as WalletType;
    if (savedWalletType) {
      setWalletType(savedWalletType);
    }
  }, []);

  // Function to fetch SUI balance (would use actual SDK in production)
  const fetchBalance = async (address: string) => {
    try {
      // In a real implementation, this would use the actual SDK to get the balance
      // For testing, we'll use a mock value
      console.log("Fetching balance for address:", address);
      
      // Mock balance for testing
      const mockBalance = 100;
      setBalance(mockBalance);
      return mockBalance;
    } catch (error) {
      console.error('Error fetching SUI balance:', error);
      return null;
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchBalance(walletAddress).catch(console.error);
    }
  }, [walletAddress]);
  
  // Helper function to check if a specific wallet extension is installed
  const isWalletExtensionInstalled = (type: WalletType): boolean => {
    console.log(`Checking if ${type} wallet is installed`);
    
    // More comprehensive checks for different wallet extensions
    switch (type) {
      case 'Slush':
        // Check using multiple methods to increase detection reliability
        return Boolean(
          (typeof window !== 'undefined' && window.slush) || 
          (typeof window !== 'undefined' && (window as any).suiWallet && (window as any).suiWallet.isSlush) ||
          (document.querySelector('[data-slush-wallet]') !== null)
        );
      case 'Martian':
        return typeof window !== 'undefined' && Boolean(window.martian);
      case 'Sui':
        return typeof window !== 'undefined' && Boolean((window as any).suiWallet);
      case 'Ethos':
        return typeof window !== 'undefined' && Boolean((window as any).ethosWallet);
      default:
        return false;
    }
  };
  
  // Function to redirect user to wallet installation page
  const redirectToWalletInstallPage = (type: WalletType) => {
    if (type && WALLET_URLS[type]) {
      window.open(WALLET_URLS[type], '_blank');
    }
  };

  // Connect to Slush Wallet using their SDK - improved implementation
  const connectToSlushWallet = async (): Promise<string> => {
    console.log("Attempting to connect to Slush wallet");
    
    // Try multiple methods to connect to Slush
    try {
      // First try the standard window.slush method
      if (typeof window.slush !== 'undefined') {
        const response = await window.slush.connect();
        console.log("Slush wallet response:", response);
        
        if (response && response.accounts && response.accounts.length > 0) {
          return response.accounts[0];
        }
      }
      
      // Try alternative access methods if standard method fails
      if (typeof (window as any).suiWallet !== 'undefined' && (window as any).suiWallet.isSlush) {
        const response = await (window as any).suiWallet.connect();
        console.log("Slush wallet (alternative) response:", response);
        
        if (response && response.accounts && response.accounts.length > 0) {
          return response.accounts[0];
        }
      }
      
      throw new Error("Failed to get account address from Slush wallet");
    } catch (error) {
      console.error("Slush wallet connection error:", error);
      throw error;
    }
  };
  
  // Connect to Martian Wallet using their SDK
  const connectToMartianWallet = async (): Promise<string> => {
    console.log("Attempting to connect to Martian wallet");
    if (typeof window.martian === 'undefined') {
      throw new Error("Martian wallet extension is not installed");
    }
    
    try {
      // Connect to Martian wallet
      const response = await window.martian.connect();
      console.log("Martian wallet response:", response);
      
      // Get the account address
      if (response && response.address) {
        return response.address;
      }
      
      throw new Error("Failed to get account address from Martian wallet");
    } catch (error) {
      console.error("Martian wallet connection error:", error);
      throw error;
    }
  };
  
  // Connect to official Sui Wallet
  const connectToSuiWallet = async (): Promise<string> => {
    console.log("Attempting to connect to Sui wallet");
    if (typeof (window as any).suiWallet === 'undefined') {
      throw new Error("Sui wallet extension is not installed");
    }
    
    try {
      const suiWallet = (window as any).suiWallet;
      // Connect to Sui wallet
      const response = await suiWallet.connect();
      console.log("Sui wallet response:", response);
      
      // Get the account address
      if (response && response.accounts && response.accounts.length > 0) {
        return response.accounts[0];
      }
      
      throw new Error("Failed to get account address from Sui wallet");
    } catch (error) {
      console.error("Sui wallet connection error:", error);
      throw error;
    }
  };
  
  // Connect to Ethos Wallet
  const connectToEthosWallet = async (): Promise<string> => {
    console.log("Attempting to connect to Ethos wallet");
    if (typeof (window as any).ethosWallet === 'undefined') {
      throw new Error("Ethos wallet extension is not installed");
    }
    
    try {
      const ethosWallet = (window as any).ethosWallet;
      // Connect to Ethos wallet
      const response = await ethosWallet.connect();
      console.log("Ethos wallet response:", response);
      
      // Get the account address
      if (response && response.accounts && response.accounts.length > 0) {
        return response.accounts[0];
      }
      
      throw new Error("Failed to get account address from Ethos wallet");
    } catch (error) {
      console.error("Ethos wallet connection error:", error);
      throw error;
    }
  };

  const connect = async (type: WalletType) => {
    try {
      setIsLoading(true);
      
      // First check if the wallet extension is installed
      if (!isWalletExtensionInstalled(type)) {
        console.error(`${type} wallet extension not detected. Will redirect to installation page.`);
        
        toast({
          title: "Wallet Extension Not Found",
          description: `${type} wallet extension is not installed. Redirecting to download page...`,
          variant: "destructive",
        });
        
        // Wait a moment for the toast to be visible before redirecting
        setTimeout(() => {
          redirectToWalletInstallPage(type);
        }, 2000);
        
        return Promise.reject(new Error(`${type} wallet extension not detected`));
      }
      
      let address = '';
      
      // Connect to the specific wallet type
      switch (type) {
        case 'Slush':
          address = await connectToSlushWallet();
          break;
        case 'Martian':
          address = await connectToMartianWallet();
          break;
        case 'Sui':
          address = await connectToSuiWallet();
          break;
        case 'Ethos':
          address = await connectToEthosWallet();
          break;
        default:
          throw new Error(`Unsupported wallet type: ${type}`);
      }
      
      if (!address) {
        throw new Error(`Failed to get address from ${type} wallet`);
      }
      
      console.log(`Connected to ${type} wallet with address: ${address}`);
      
      // Update state with real wallet address
      setWalletAddress(address);
      setIsConnected(true);
      setWalletType(type);
      
      // Save to local storage
      localStorage.setItem('walletType', type);
      
      toast({
        title: `${type} Wallet Connected`,
        description: `Your ${type} wallet has been successfully connected.`,
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error(`Error connecting to ${type} wallet:`, error);
      
      // Get the detailed error message
      const errorMessage = error instanceof Error ? error.message : `Failed to connect your ${type} wallet.`;
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    // Attempt to disconnect from active wallet if connected
    try {
      if (walletType === 'Slush' && window.slush) {
        window.slush.disconnect();
      } else if (walletType === 'Martian' && window.martian) {
        window.martian.disconnect();
      } else if (walletType === 'Sui' && (window as any).suiWallet) {
        (window as any).suiWallet.disconnect();
      } else if (walletType === 'Ethos' && (window as any).ethosWallet) {
        (window as any).ethosWallet.disconnect();
      }
    } catch (error) {
      console.error(`Error disconnecting from ${walletType} wallet:`, error);
    }
    
    // Reset wallet state
    setIsConnected(false);
    setWalletAddress(null);
    setBalance(null);
    setWalletType(null);
    localStorage.removeItem('walletType');
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const value = {
    isConnected,
    walletAddress,
    balance,
    walletType,
    connect,
    disconnect,
    isLoading
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export default InnerWalletProvider;
