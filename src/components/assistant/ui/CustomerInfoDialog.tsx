import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  domain: string;
  budget: string;
  needs: string;
  quoteOptIn: boolean;
}

interface CustomerInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customerInfo: CustomerInfo) => void;
}

export function CustomerInfoDialog({ isOpen, onClose, onSubmit }: CustomerInfoDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    domain: '',
    budget: '',
    needs: '',
    quoteOptIn: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setCustomerInfo((prev) => ({ ...prev, quoteOptIn: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(customerInfo);
      toast({
        title: "Information submitted",
        description: "Thank you for your interest. We'll be in touch soon.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "An error occurred while submitting your information.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tell us about yourself</DialogTitle>
            <DialogDescription>
              Complete this form to help us prepare a personalized proposal for your needs.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="required">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={customerInfo.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="required">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={customerInfo.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="required">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={customerInfo.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company" className="required">Company</Label>
              <Input
                id="company"
                name="company"
                value={customerInfo.company}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                name="domain"
                value={customerInfo.domain}
                onChange={handleChange}
                placeholder="e.g., analytics, e-commerce, finance"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range</Label>
              <Input
                id="budget"
                name="budget"
                value={customerInfo.budget}
                onChange={handleChange}
                placeholder="e.g., $5,000 - $10,000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="needs">Tell us about your needs</Label>
              <Textarea
                id="needs"
                name="needs"
                value={customerInfo.needs}
                onChange={handleChange}
                placeholder="Please describe your requirements in detail"
                rows={4}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="quoteOptIn" 
                checked={customerInfo.quoteOptIn}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="quoteOptIn" className="font-normal">
                I'd like to receive a quote based on the information provided
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 