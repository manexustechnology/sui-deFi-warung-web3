
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BuyerLoginForm from '@/components/auth/BuyerLoginForm';
import SellerLoginForm from '@/components/auth/SellerLoginForm';
import { Button } from '@/components/ui/button';
import AuthDivider from '@/components/auth/AuthDivider';
import WalletConnection from '@/components/auth/WalletConnection';
import { Mail } from 'lucide-react';

interface LoginCardProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  authLoading: boolean;
  activeTab: 'buyer' | 'seller';
  setActiveTab: (tab: 'buyer' | 'seller') => void;
  handleEmailLogin: (e: React.FormEvent) => Promise<void>;
  handleEmailSignIn: () => Promise<void>;
  fillDemoCredentials: (type: 'seller' | 'buyer') => void;
}

const LoginCard: React.FC<LoginCardProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  authLoading,
  activeTab,
  setActiveTab,
  handleEmailLogin,
  handleEmailSignIn,
  fillDemoCredentials
}) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Login to DeFi Warung WEB3
        </CardTitle>
        <CardDescription className="text-center">
          Sign in to your account or connect your Solana wallet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs 
          defaultValue="seller" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'buyer' | 'seller')}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buyer">As Buyer</TabsTrigger>
            <TabsTrigger value="seller">As Seller</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buyer">
            <BuyerLoginForm 
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              isLoading={isLoading}
              authLoading={authLoading}
              handleEmailLogin={handleEmailLogin}
            />
            <div className="mt-2">
              <Button 
                variant="ghost"
                size="sm"
                className="text-xs underline"
                onClick={() => fillDemoCredentials('buyer')}
              >
                Use demo buyer credentials
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="seller">
            <SellerLoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              isLoading={isLoading}
              authLoading={authLoading}
              handleEmailLogin={handleEmailLogin}
            />
            <div className="mt-2">
              <Button 
                variant="ghost"
                size="sm"
                className="text-xs underline"
                onClick={() => fillDemoCredentials('seller')}
              >
                Use demo seller credentials
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <AuthDivider />

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center space-x-2 h-12"
            onClick={handleEmailSignIn}
            disabled={isLoading || authLoading}
          >
            {isLoading || authLoading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing in...</span>
              </span>
            ) : (
              <>
                <Mail className="h-5 w-5 mr-2" />
                <span>Sign in with Email as {activeTab === 'seller' ? 'Seller' : 'Buyer'}</span>
              </>
            )}
          </Button>
        </div>

        <WalletConnection />
      </CardContent>
      <CardFooter className="flex justify-center text-center">
        <p className="text-sm text-muted-foreground">
          Sign in securely with your email or wallet
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginCard;
