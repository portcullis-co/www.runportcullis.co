// localhost/api/assistant/dailin [POST]

import type { APIRoute } from 'astro';
import {
    defaultBotProfile,
    defaultConfig,
    defaultMaxDuration,
    defaultServices,
  } from "@/rtvi.config";
  
  export const POST: APIRoute = async ({ request }) => {
    try {
      const { test, callId, callDomain } = await request.json();
  
      //@TODO: HMAC header verification
  
      if (test) {
        // Webhook creation test response
        return new Response(JSON.stringify({ test: true }), { 
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
  
      if (!callId || !callDomain || !import.meta.env.DAILY_BOTS_URL) {
        return new Response(JSON.stringify({ error: `callId or callDomain not found on request body` }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
  
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
          callId,
          callDomain,
        },
      };
  
      const req = await fetch(import.meta.env.DAILY_BOTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.DAILY_BOTS_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });
  
      const res = await req.json();
  
      if (req.status !== 200) {
        return new Response(JSON.stringify(res), { 
          status: req.status,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
  
      return new Response(JSON.stringify(res), { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error("Error in dailin API route:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  };