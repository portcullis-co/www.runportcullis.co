"use client";

import { useState, useCallback } from "react";
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
}

export default function SlackConnectDialog() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [consent, setConsent] = useState(false);
  const [formData, setFormData] = useState<BusinessData>({
    email: "",
    firstName: "",
    lastName: "",
    companyName: "",
    jobTitle: "",
  });

  const isFormValid = useCallback(() => {
    return Object.values(formData).every(value => value.trim() !== "") && consent;
  }, [formData, consent]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button 
        onClick={() => setOpen(true)}
        size="lg"
        className="flex items-center"
      >
        <svg className="mr-2 h-4 w-4" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Slack</title><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>
        <span className="text-xs">Start Trial</span>
      </Button>
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
              <DialogTitle>Connect with us on Slack</DialogTitle>
              <DialogDescription>
                Fill out this form to get an invitation to our Slack workspace.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  required
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  required
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                <Input
                  required
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Input
                  required
                  name="companyName"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Input
                  required
                  name="jobTitle"
                  placeholder="Job Title"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="consent"
                  id="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                />
                <label htmlFor="consent" className="text-sm text-gray-600">
                  I agree to the <a href="/legal/terms" className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>Terms of Service</a> and{" "}
                  <a href="/legal/privacy" className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>Privacy Policy</a>
                </label>
              </div>
              <Button 
                type="submit" 
                disabled={status === "loading" || !isFormValid()} 
                className="w-full"
              >
                {status === "loading" ? "Sending..." : "Get Slack Invite"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}