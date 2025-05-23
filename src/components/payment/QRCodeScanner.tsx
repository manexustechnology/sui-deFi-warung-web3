
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Camera, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface PaymentInfo {
  receiverAddress: string;
  amount: number;
  transactionId: string;
  timestamp: number;
}

const QRCodeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<PaymentInfo | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  
  // Start the camera
  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
        
        // Start scanning for QR codes
        setTimeout(scanQRCode, 1000);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: 'Camera Access Error',
        description: 'We could not access your camera. Please check permissions.',
        variant: 'destructive',
      });
    }
  };
  
  // Stop the camera
  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsScanning(false);
    }
  };
  
  // Handle payment confirmation
  const handleConfirmPayment = () => {
    if (!scannedData) return;
    
    // Navigate to payment execution page
    navigate('/payment/execute', { 
      state: {
        paymentInfo: scannedData
      }
    });
  };
  
  // Scan for QR codes
  const scanQRCode = () => {
    if (!isScanning) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Mock QR code detection for demo purposes
        // In a real app, you would use a QR code scanner library here
        setTimeout(() => {
          if (isScanning) {
            // Simulate finding a QR code after a few seconds
            const mockPaymentInfo: PaymentInfo = {
              receiverAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
              amount: 25.5,
              transactionId: `tx-${Date.now().toString(36)}`,
              timestamp: Date.now()
            };
            
            setScannedData(mockPaymentInfo);
            stopScanner();
            
            toast({
              title: 'QR Code Detected',
              description: 'Payment information scanned successfully.',
            });
          }
        }, 3000);
      }
    }
    
    if (isScanning) {
      requestAnimationFrame(scanQRCode);
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);
  
  return (
    <div className="container py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-6 w-6" />
            Crypto Payment Scanner
          </CardTitle>
          <CardDescription>
            Scan a QR code to make a crypto payment
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!isScanning && !scannedData ? (
            <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg">
              <Camera className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-center text-muted-foreground">
                Tap the button below to scan a crypto payment QR code
              </p>
            </div>
          ) : isScanning ? (
            <div className="relative aspect-square rounded-lg overflow-hidden border border-border">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ display: 'none' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2/3 h-2/3 border-2 border-primary rounded-lg opacity-70"></div>
              </div>
              <Button 
                variant="secondary" 
                size="icon" 
                className="absolute top-2 right-2"
                onClick={stopScanner}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : scannedData ? (
            <div className="space-y-4 p-4 bg-secondary/20 rounded-lg">
              <h3 className="font-semibold text-lg">Payment Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To:</span>
                  <span className="font-mono text-sm">{`${scannedData.receiverAddress.slice(0, 6)}...${scannedData.receiverAddress.slice(-4)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-semibold">{scannedData.amount} SUI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-mono text-sm">{scannedData.transactionId}</span>
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          {!isScanning && !scannedData ? (
            <Button className="w-full" onClick={startScanner}>
              <Camera className="mr-2 h-4 w-4" />
              Start Scanning
            </Button>
          ) : scannedData ? (
            <div className="flex w-full gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setScannedData(null)}>
                Scan Again
              </Button>
              <Button className="flex-1" onClick={handleConfirmPayment}>
                Confirm Payment
              </Button>
            </div>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
};

export default QRCodeScanner;
