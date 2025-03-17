import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Phone, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PhoneInput } from '@/components/ui/phone-input';
import { isValidPhoneNumber } from 'libphonenumber-js';

interface CallRequestDialogProps {
  open: boolean;
  onClose: () => void;
  message?: string;
}

export const CallRequestDialog: React.FC<CallRequestDialogProps> = ({ 
  open, 
  onClose,
  message = "Enter your phone number to receive a call from our AI assistant."
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation using libphonenumber-js
    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/assistant/dialout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate call');
      }
      
      setSuccess(true);
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setPhoneNumber('');
      }, 5000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex justify-between items-center w-full">
            <DialogTitle>Request a Call</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success ? (
            <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
              <AlertDescription>
                Call initiated! We'll be connecting you with a Portcullis representative shortly.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <PhoneInput
                    id="phone-number"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    defaultCountry="US"
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter your phone number to receive a call
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Initiating Call...
                    </>
                  ) : (
                    <>
                      <Phone className="mr-2 h-4 w-4" />
                      Request Call
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CallRequestDialog; 