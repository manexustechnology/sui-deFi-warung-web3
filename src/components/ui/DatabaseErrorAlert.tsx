
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface DatabaseErrorAlertProps {
  isDemo: boolean;
  errorMessage?: string | null;
  className?: string;
}

export function DatabaseErrorAlert({ isDemo, errorMessage, className = '' }: DatabaseErrorAlertProps) {
  const { toast } = useToast();
  
  if (!isDemo) return null;
  
  const handleViewDetails = () => {
    if (errorMessage) {
      toast({
        title: "Database Error Details",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  
  return (
    <Alert className={`mb-4 bg-amber-50 border-amber-200 ${className}`}>
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800 flex items-center justify-between">
        <span>Currently displaying demo data. Database connection issues detected.</span>
        {errorMessage && (
          <Button 
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="text-xs bg-amber-200 hover:bg-amber-300 border-amber-300 text-amber-900 ml-2"
          >
            View Details
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
