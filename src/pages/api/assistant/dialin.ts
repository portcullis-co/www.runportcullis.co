// Pinless Dial-in endpoint for Daily Bots
// Documentation: https://docs.dailybots.ai/api-reference/endpoint/pinlessDialin

import type { APIRoute } from 'astro';
import {
  defaultBotProfile,
  defaultConfig,
  defaultMaxDuration,
  defaultServices,
} from "@/rtvi.config";

// This endpoint serves two purposes:
// 1. As a webhook for Daily to call when an incoming call is received
// 2. As an API endpoint to set up the pinless dial-in configuration

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    console.log("📞 Received dial-in request:", JSON.stringify(data));

    // Case 1: If this is a test request from Daily for webhook verification
    if (data.test || (data.To && typeof data.To === 'string')) {
      console.log("📞 Handling test request from Daily");
      return new Response(JSON.stringify({ success: true, test: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Case 2: If this is an incoming call webhook from Daily (contains callId and callDomain)
    if (data.callId && data.callDomain) {
      console.log(`📞 Handling incoming call: ${data.callId} from ${data.callDomain}`);
      
      // Check environment variables
      if (!import.meta.env.DAILY_BOTS_URL) {
        console.error("❌ Missing DAILY_BOTS_URL environment variable");
        return new Response(JSON.stringify({ 
          error: "Server configuration error: Missing DAILY_BOTS_URL" 
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

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
        dialin_settings: {
          callId: data.callId,
          callDomain: data.callDomain,
        },
      };

      console.log(`📞 Starting Daily bot for call: ${data.callId}`);
      
      // Call Daily Bots API to start the bot
      const response = await fetch(import.meta.env.DAILY_BOTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.DAILY_BOTS_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`❌ Failed to start Daily bot: ${response.status}`, errorData);
        return new Response(JSON.stringify(errorData), {
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const result = await response.json();
      console.log(`✅ Successfully started Daily bot for call: ${data.callId}`);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Case 3: If this is a configuration request (to set up pinless dial-in)
    if (data.configure && data.phoneNumber) {
      console.log(`📞 Setting up pinless dial-in for number: ${data.phoneNumber}`);
      
      if (!import.meta.env.DAILY_API_KEY) {
        console.error("❌ Missing DAILY_API_KEY environment variable");
        return new Response(JSON.stringify({ 
          error: "Server configuration error: Missing DAILY_API_KEY" 
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Create payload for Daily API to configure pinless dial-in
      const configPayload = {
        properties: {
          pinless_dialin: [
            {
              phone_number: data.phoneNumber,
              room_creation_api: new URL("/api/assistant/dialin", request.url).toString(),
              name_prefix: data.namePrefix || "portcullis-call",
              hmac: data.hmac // Optional, Daily will generate one if not provided
            }
          ]
        }
      };

      // Call Daily API to configure pinless dial-in
      const configResponse = await fetch("https://api.daily.co/v1/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.DAILY_API_KEY}`,
        },
        body: JSON.stringify(configPayload),
      });

      if (!configResponse.ok) {
        const errorData = await configResponse.json();
        console.error(`❌ Failed to configure pinless dial-in: ${configResponse.status}`, errorData);
        return new Response(JSON.stringify(errorData), {
          status: configResponse.status,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const configResult = await configResponse.json();
      console.log(`✅ Successfully configured pinless dial-in for number: ${data.phoneNumber}`);
      return new Response(JSON.stringify(configResult), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // If we got here, the request was invalid
    console.error("❌ Invalid request format");
    return new Response(JSON.stringify({ 
      error: "Invalid request format",
      message: "Request must include either test flag, callId+callDomain for incoming calls, or configure+phoneNumber for setup"
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("❌ Error in dialin API route:", error);
    return new Response(JSON.stringify({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};