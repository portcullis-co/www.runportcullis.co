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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
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
                  checked={formData.consent}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="consent" className="text-sm text-gray-600">
                  I agree to the <a href="/legal/terms" className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>Terms of Service</a> and{" "}
                  <a href="/legal/privacy" className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>Privacy Policy</a>
                </label>
              </div>
              <Button type="submit" disabled={status === "loading"} className="w-full">
                {status === "loading" ? "Sending..." : "Get Slack Invite"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}