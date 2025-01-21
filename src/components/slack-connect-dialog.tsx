"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BusinessData {
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  jobTitle: string;
  consent: boolean;
}

export default function SlackConnectDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState<BusinessData>({
    email: "",
    firstName: "",
    lastName: "",
    companyName: "",
    jobTitle: "",
    consent: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {

      const response = await fetch("/api/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>{children}</div>
      <DialogContent className="sm:max-w-[600px]">
        {status === "success" ? (
          <DialogHeader>
            <DialogTitle>Invitation Sent!</DialogTitle>
            <DialogDescription>
              Check your email for an invitation to connect with us on Slack.
            </DialogDescription>
            <Button onClick={() => setOpen(false)} className="mt-4">
              Close
            </Button>
          </DialogHeader>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Get a free one-week trial</DialogTitle>
              <DialogDescription>
                Tell us about your business to get started.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Work Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@company.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <Input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Title</label>
                  <Input
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    className="mt-1"
                    checked={formData.consent}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="consent" className="text-sm text-gray-600">
                    I agree to receive communications from Portcullis. You can unsubscribe at any time.
                    By submitting this form, you acknowledge that you have read and understand our{' '}
                    <a 
                      href="/legal/privacy" 
                      target="_blank" 
                      className="text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Privacy Policy
                    </a>
                    {' '}and{' '}
                    <a 
                      href="/legal/terms" 
                      target="_blank" 
                      className="text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Terms of Service
                    </a>.
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={status === "loading" || !formData.consent}
                >
                  {status === "loading" ? "Sending..." : "Send Invitation"}
                </Button>

                {status === "error" && (
                  <p className="text-sm text-red-500 mt-2">
                    Please use your work email. Free email providers are not allowed.
                  </p>
                )}
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}