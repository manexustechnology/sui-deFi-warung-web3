
import React from 'react';
import { Link } from 'react-router-dom';
import { X, Menu, Search } from 'lucide-react';
import WalletButton from '../ui/WalletButton';
import { useWallet } from '@/context/WalletContext';

interface MobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
  isLoggedIn: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ 
  isOpen, 
  onToggle, 
  onLogout,
  isLoggedIn
}) => {
  const { isConnected, walletAddress, balance } = useWallet();

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="md:hidden p-2 rounded-full hover:bg-secondary transition-colors duration-200"
        onClick={onToggle}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile menu overlay */}
      <div 
        className={`md:hidden fixed inset-0 z-40 bg-white pt-20 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="absolute top-6 left-0 w-full px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3" onClick={onToggle}>
            <img 
              src="/image-uploads/3bbf96d4-15c6-42f2-82b0-37d6c89c739b.png" 
              alt="DeFi Warung WEB3 Logo"
              className="h-8 w-auto object-contain" 
            />
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              DeFi Warung WEB3
            </span>
          </Link>
          <button 
            onClick={onToggle}
            aria-label="Close menu"
            className="p-2 rounded-full hover:bg-secondary transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="container mx-auto px-6 py-4 flex flex-col mt-10">
          <Link 
            to="/" 
            className="py-3 border-b border-gray-100"
            onClick={onToggle}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className="py-3 border-b border-gray-100"
            onClick={onToggle}
          >
            Products
          </Link>
          <Link 
            to="/about" 
            className="py-3 border-b border-gray-100"
            onClick={onToggle}
          >
            About
          </Link>
          <div className="mt-4 flex flex-col space-y-4">
            <button className="flex items-center space-x-2 p-2 rounded-full bg-secondary w-full justify-center" aria-label="Search">
              <Search className="h-5 w-5" /> <span>Search</span>
            </button>
            {isConnected && (
              <div className="flex items-center justify-center space-x-2 p-2 rounded-md bg-green-50 border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">
                  {walletAddress?.substring(0, 6)}...{walletAddress?.substring(walletAddress?.length - 4)} 
                  {balance !== null && ` (${balance.toFixed(2)} SUI)`}
                </span>
              </div>
            )}
            {isLoggedIn ? (
              <button className="w-full p-2 bg-red-500 text-white rounded-md" onClick={onLogout}>
                Logout
              </button>
            ) : (
              <div className="p-2">
                <WalletButton fullWidth navigateToLogin={true} />
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default MobileNav;
