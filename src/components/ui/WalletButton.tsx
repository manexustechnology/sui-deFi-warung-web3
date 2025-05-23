
import React from 'react';
import { Wallet, ChevronDown, Loader } from 'lucide-react';
import { useWallet } from '@/context/wallet'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { WalletType } from '@/context/wallet/types';
import { useLanguage } from '@/context/LanguageContext';

type WalletButtonProps = {
  fullWidth?: boolean;
  navigateToLogin?: boolean;
};

const WalletButton = ({ fullWidth = false, navigateToLogin = false }: WalletButtonProps) => {
  const { isConnected, connect, disconnect, walletAddress, walletType, isLoading } = useWallet();
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const { t, language } = useLanguage();

  const handleConnect = async (walletType: WalletType) => {
    if (navigateToLogin) {
      navigate('/login');
      return;
    }

    try {
      // Only allow connection with Martian wallet
      if (walletType !== 'Martian') {
        console.log("Only Martian wallet is currently supported");
        return;
      }
      
      // This will attempt to connect to the actual wallet extension
      await connect(walletType);
      
      // Auto login as buyer when connecting wallet
      if (!user) {
        await signIn('wallet@example.com', 'walletauth');
      }
    } catch (error) {
      // Error handling is done in the wallet provider
      console.error("Wallet connection error:", error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  if (isConnected) {
    return (
      <button
        className={`btn-primary flex items-center justify-center space-x-2 ${fullWidth ? 'w-full' : ''}`}
        onClick={handleDisconnect}
        disabled={isLoading}
      >
        <Wallet className="h-5 w-5" />
        <span>{`${walletAddress?.substring(0, 6)}...${walletAddress?.substring(walletAddress.length - 4)}`}</span>
      </button>
    );
  }

  const walletLabel = language === 'en' ? 'Connect Wallet' : 'Hubungkan Wallet';
  const loadingLabel = language === 'en' ? 'Connecting...' : 'Menghubungkan...';
  const installLabel = language === 'en' ? 'Don\'t have a wallet?' : 'Belum punya wallet?';
  const installSlushLabel = language === 'en' ? 'Install Slush Wallet' : 'Pasang Wallet Slush';
  const installMartianLabel = language === 'en' ? 'Install Martian Wallet' : 'Pasang Wallet Martian';
  const installSuiLabel = language === 'en' ? 'Install Sui Wallet' : 'Pasang Wallet Sui';
  const installEthosLabel = language === 'en' ? 'Install Ethos Wallet' : 'Pasang Wallet Ethos';
  const comingSoonLabel = language === 'en' ? '(Coming Soon)' : '(Segera Hadir)';

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`btn-primary flex items-center justify-center space-x-2 ${fullWidth ? 'w-full' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                {loadingLabel}
              </span>
            ) : (
              <>
                <Wallet className="h-5 w-5" />
                <span>{walletLabel}</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem 
            className="cursor-not-allowed opacity-50"
            onClick={(e) => e.preventDefault()}
          >
            Slush Wallet {comingSoonLabel}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleConnect('Martian')}>
            Martian Wallet
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-not-allowed opacity-50"
            onClick={(e) => e.preventDefault()}
          >
            Sui Wallet {comingSoonLabel}
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-not-allowed opacity-50"
            onClick={(e) => e.preventDefault()}
          >
            Ethos Wallet {comingSoonLabel}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <div className="px-2 py-1 text-xs text-gray-500">
            <span>{installLabel}</span>
          </div>
          <DropdownMenuItem 
            className="cursor-not-allowed opacity-50"
            onClick={(e) => e.preventDefault()}
          >
            <span className="text-xs">{installSlushLabel} {comingSoonLabel}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.open('https://martianwallet.xyz/', '_blank')}>
            <span className="text-xs">{installMartianLabel}</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-not-allowed opacity-50"
            onClick={(e) => e.preventDefault()}
          >
            <span className="text-xs">{installSuiLabel} {comingSoonLabel}</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-not-allowed opacity-50"
            onClick={(e) => e.preventDefault()}
          >
            <span className="text-xs">{installEthosLabel} {comingSoonLabel}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default WalletButton;
