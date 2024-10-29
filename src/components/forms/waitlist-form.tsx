import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({
    message: "Email is not valid.",
  }),
});

export function WaitlistForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');

    try {
      const response = await fetch('/api/slack/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      if (data.ok && data.invite_url) {
        window.location.href = data.invite_url;
      } else {
        alert('Failed to create Slack invite');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send invitation');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        name="email"
        required
        placeholder="Enter your email"
        className="w-full px-4 py-2 border rounded"
      />
      <button
        type="submit"
        className="w-full px-4 py-2 bg-primary text-white rounded"
      >
        Get Slack Invite
      </button>
    </form>
  );
}
