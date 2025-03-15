// Daily Bots Dialout API Endpoint
// Used to have the AI call a phone number

import type { APIRoute } from 'astro';
import {
    defaultBotProfile,
    defaultConfig,
    defaultMaxDuration,
    defaultServices,
  } from "@/rtvi.config";
  
  export const POST: APIRoute = async ({ request }) => {
    try {
      console.log("📱 Received dialout request");
      const data = await request.json();
      
      // Log request but exclude sensitive information like phone numbers
      console.log("📱 Request data received", { 
        ...data, 
        phoneNumber: data.phoneNumber ? '✓ [REDACTED]' : '✗ Missing' 
      });

      // Validate request data
      if (!data.phoneNumber || !import.meta.env.DAILY_BOTS_URL) {
        const errorMsg = `PhoneNumber: ${data.phoneNumber ? '✓' : '✗'}, DAILY_BOTS_URL: ${import.meta.env.DAILY_BOTS_URL ? '✓' : '✗'}`;
        console.error("📱 Validation error:", errorMsg);
        
        return new Response(JSON.stringify({ 
          error: `Missing required parameters. ${errorMsg}`
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

      // Check environment variables
      console.log("📱 Environment variables check:");
      console.log("- DAILY_BOTS_URL:", import.meta.env.DAILY_BOTS_URL ? "✅ Set" : "❌ Missing");
      console.log("- DAILY_BOTS_API_KEY:", import.meta.env.DAILY_BOTS_API_KEY ? "✅ Set" : "❌ Missing");
      console.log("- TOGETHER_API_KEY:", import.meta.env.TOGETHER_API_KEY ? "✅ Set" : "❌ Missing");
      console.log("- CARTESIA_API_KEY:", import.meta.env.CARTESIA_API_KEY ? "✅ Set" : "❌ Missing");

      // Create the dialout settings
      const dialout_settings = [{
        phoneNumber: data.phoneNumber,
        // Optional parameters if provided
        callerId: data.callerId || undefined,
        countryCode: data.countryCode || 'US',
        greeting: data.greeting || "Hello, this is Porticia, an AI assistant from Portcullis. I'm calling because you requested information. How can I help you today?"
      }];

      // Create payload for Daily Bots API
      const payload = {
        bot_profile: defaultBotProfile,
        services: defaultServices,
        max_duration: defaultMaxDuration,
        api_keys: {
          together: import.meta.env.TOGETHER_API_KEY,
          cartesia: import.meta.env.CARTESIA_API_KEY,
        },
        config: defaultConfig,
        dialout_settings
      };

      console.log(`📱 Initiating call to phone number`);
      
      try {
        // Call Daily Bots API to start the bot and place the call
        const response = await fetch(import.meta.env.DAILY_BOTS_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.DAILY_BOTS_API_KEY}`,
          },
          body: JSON.stringify(payload),
        });
        
        // Parse response
        const result = await response.json();
        
        if (!response.ok) {
          console.error(`📱 Error from Daily Bots API: ${response.status}`, result);
          return new Response(JSON.stringify({
            error: "Failed to initiate call",
            details: result
          }), { 
            status: response.status,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        console.log(`📱 Successfully initiated call`);
        return new Response(JSON.stringify({
          success: true,
          message: "Call initiated successfully",
          callDetails: result
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (fetchError) {
        console.error(`📱 Network error when calling Daily Bots API:`, fetchError);
        throw fetchError; // Re-throw to be caught by outer try/catch
      }
    } catch (error) {
      console.error("📱 Error in dialout API route:", error);
      return new Response(JSON.stringify({ 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  };