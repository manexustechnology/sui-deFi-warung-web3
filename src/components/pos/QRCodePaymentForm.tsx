
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QrCode, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/context/WalletContext';

interface QRCodePaymentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  onPaymentComplete: () => void;
}

const QRCodePaymentForm = ({ 
  open, 
  onOpenChange, 
  total, 
  onPaymentComplete 
}: QRCodePaymentFormProps) => {
  const { toast } = useToast();
  const { isConnected, walletAddress } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [transactionId, setTransactionId] = useState('');
  
  // Generate transaction ID when opened
  useEffect(() => {
    if (open) {
      setTransactionId(`tx-${Date.now().toString(36)}`);
      setTimeLeft(300); // Reset timer when dialog opens
    }
  }, [open]);
  
  // Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (open && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [open, timeLeft]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Create payment data for QR code
  const getPaymentData = () => {
    if (!isConnected || !walletAddress) {
      return null;
    }
    
    const paymentData = {
      receiverAddress: walletAddress,
      amount: total,
      transactionId: transactionId,
      timestamp: Date.now()
    };
    
    return JSON.stringify(paymentData);
  };
  
  const handleCheckPayment = () => {
    setIsProcessing(true);
    
    // Simulate payment verification
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Successful",
        description: `QR code payment of $${total.toFixed(2)} was successful.`,
      });
      
      // Close dialog and notify parent component
      onOpenChange(false);
      onPaymentComplete();
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Payment
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Ask your customer to scan this QR code</p>
            <div className="font-bold text-lg mb-4">${total.toFixed(2)} ({total.toFixed(2)} SUI)</div>
            
            {isConnected ? (
              <div className="bg-white p-4 mx-auto w-64 h-64 flex items-center justify-center relative rounded-lg">
                {/* SVG QR Code for demo - in production this would be generated dynamically */}
                <svg 
                  className="w-full h-full" 
                  viewBox="0 0 29 29" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="0.5" y="0.5" width="10" height="10" fill="black" />
                  <rect x="13.5" y="0.5" width="3" height="3" fill="black" />
                  <rect x="18.5" y="0.5" width="10" height="10" fill="black" />
                  <rect x="3.5" y="3.5" width="4" height="4" fill="white" />
                  <rect x="21.5" y="3.5" width="4" height="4" fill="white" />
                  <rect x="0.5" y="13.5" width="3" height="3" fill="black" />
                  <rect x="6.5" y="13.5" width="4" height="1" fill="black" />
                  <rect x="13.5" y="13.5" width="3" height="3" fill="black" />
                  <rect x="18.5" y="13.5" width="3" height="3" fill="black" />
                  <rect x="25.5" y="13.5" width="3" height="3" fill="black" />
                  <rect x="0.5" y="18.5" width="10" height="10" fill="black" />
                  <rect x="3.5" y="21.5" width="4" height="4" fill="white" />
                  <rect x="13.5" y="18.5" width="2" height="1" fill="black" />
                  <rect x="18.5" y="18.5" width="1" height="1" fill="black" />
                  <rect x="22.5" y="18.5" width="6" height="1" fill="black" />
                  <rect x="13.5" y="22.5" width="1" height="6" fill="black" />
                  <rect x="18.5" y="22.5" width="6" height="6" fill="black" />
                </svg>

                <div className="absolute bottom-0 right-0 left-0 bg-black/10 p-1 text-xs font-mono">
                  {transactionId}
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 p-4 mx-auto w-64 h-64 flex items-center justify-center rounded-lg">
                <p className="text-sm text-gray-500">
                  Please connect your wallet to generate a payment QR code
                </p>
              </div>
            )}
            
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">QR code expires in</p>
              <p className="font-mono font-semibold">{formatTime(timeLeft)}</p>
            </div>

            {isConnected && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded text-sm text-blue-800">
                <p>Payment will be sent to:</p>
                <p className="font-mono text-xs mt-1">
                  {`${walletAddress?.substring(0, 8)}...${walletAddress?.substring(walletAddress.length - 8)}`}
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-yellow-700">
            <p>For demo purposes, click "Check Payment Status" to simulate a successful transaction.</p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCheckPayment}
              disabled={isProcessing || !isConnected}
            >
              {isProcessing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Check Payment Status
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodePaymentForm;
