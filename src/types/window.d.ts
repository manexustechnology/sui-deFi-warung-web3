// Type definitions for wallet extensions

interface SlushWalletResponse {
  accounts: string[];
  publicKey?: string;
  // Other possible properties returned by Slush wallet
}

interface MartianWalletResponse {
  address: string;
  publicKey?: string;
  // Other possible properties returned by Martian wallet
}

interface SuiWalletResponse {
  accounts: string[];
  publicKey?: string;
  // Other properties from Sui wallet
}

interface EthosWalletResponse {
  accounts: string[];
  publicKey?: string;
  // Other properties from Ethos wallet
}

interface SlushWallet {
  connect: () => Promise<SlushWalletResponse>;
  disconnect: () => Promise<void>;
  isSlush?: boolean;
  // Other methods that Slush wallet might have
}

interface MartianWallet {
  connect: () => Promise<MartianWalletResponse>;
  disconnect: () => Promise<void>;
  // Other methods that Martian wallet might have
}

interface SuiWallet {
  connect: () => Promise<SuiWalletResponse>;
  disconnect: () => Promise<void>;
  // Other methods that Sui wallet might have
}

interface EthosWallet {
  connect: () => Promise<EthosWalletResponse>;
  disconnect: () => Promise<void>;
  // Other methods that Ethos wallet might have
}

interface Window {
  slush?: SlushWallet;
  martian?: MartianWallet;
  suiWallet?: SuiWallet;
  ethosWallet?: EthosWallet;
}
