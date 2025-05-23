
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowRight, CheckCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/context/WalletContext';
import { sendTokens } from '@/utils/sui';

interface PaymentInfo {
  receiverAddress: string;
  amount: number;
  transactionId: string;
  timestamp: number;
}

const PaymentExecute = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isConnected, walletAddress, balance } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  
  // Get payment info from location state
  const paymentInfo = location.state?.paymentInfo as PaymentInfo | undefined;
  
  // If no payment info, redirect to scanner page
  useEffect(() => {
    if (!paymentInfo) {
      navigate('/payment/scan');
    }
  }, [paymentInfo, navigate]);
  
  // Execute payment
  const handleExecutePayment = async () => {
    if (!paymentInfo || !isConnected || !walletAddress) {
      toast({
        title: "Payment Failed",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }
    
    if (balance !== null && balance < paymentInfo.amount) {
      toast({
        title: "Insufficient Balance",
        description: `You need at least ${paymentInfo.amount} SUI to complete this payment.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call SUI blockchain utility for sending tokens
      const result = await sendTokens(
        walletAddress,
        paymentInfo.receiverAddress,
        paymentInfo.amount
      );
      
      if (result.success && result.txHash) {
        setTxHash(result.txHash);
        setIsSuccess(true);
        toast({
          title: "Payment Successful",
          description: "Your SUI payment has been processed successfully.",
        });
      } else {
        throw new Error(result.error || "Transaction failed");
      }
    } catch (error) {
      console.error("Payment execution error:", error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Return to home
  const handleReturnHome = () => {
    navigate('/');
  };
  
  if (!paymentInfo) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <div className="container py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isSuccess ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-500" />
                Payment Successful
              </>
            ) : (
              <>
                <Wallet className="h-6 w-6" />
                Execute Payment
              </>
            )}
          </CardTitle>
          <CardDescription>
            {isSuccess 
              ? "Your payment has been processed successfully" 
              : "Review and confirm your SUI payment"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4 p-4 bg-secondary/20 rounded-lg">
            <h3 className="font-semibold text-lg">Payment Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recipient Address:</span>
                <span className="font-mono text-sm">
                  {`${paymentInfo.receiverAddress.slice(0, 6)}...${paymentInfo.receiverAddress.slice(-4)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-semibold">{paymentInfo.amount} SUI</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-mono text-sm">{paymentInfo.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{new Date(paymentInfo.timestamp).toLocaleString()}</span>
              </div>
              {isSuccess && txHash && (
                <div className="flex justify-between items-start mt-4 pt-4 border-t border-border">
                  <span className="text-muted-foreground">Transaction Hash:</span>
                  <div className="flex items-center">
                    <span className="font-mono text-sm mr-2">{`${txHash.slice(0, 8)}...${txHash.slice(-6)}`}</span>
                    <a 
                      href={`https://explorer.sui.io/transaction/${txHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {!isSuccess && isConnected && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="text-sm">
                  <span className="font-medium">Wallet Connected: </span>
                  <span className="font-mono">
                    {`${walletAddress?.substring(0, 6)}...${walletAddress?.substring(walletAddress.length - 4)}`}
                  </span>
                </div>
              </div>
              {balance !== null && (
                <div className="mt-2 text-sm pl-4">
                  <span className="font-medium">Balance: </span>
                  <span>{balance.toFixed(2)} SUI</span>
                </div>
              )}
            </div>
          )}
          
          {!isSuccess && !isConnected && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Please connect your wallet to proceed with the payment.
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          {isSuccess ? (
            <Button className="w-full" onClick={handleReturnHome}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          ) : (
            <Button 
              className="w-full" 
              onClick={handleExecutePayment}
              disabled={isProcessing || !isConnected || (balance !== null && balance < paymentInfo.amount)}
            >
              {isProcessing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Pay {paymentInfo.amount} SUI
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentExecute;
