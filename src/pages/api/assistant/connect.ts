// src/pages/api/assistant/connect.ts
import type { APIRoute } from 'astro';
import { 
  defaultBotProfile, 
  defaultMaxDuration, 
  defaultServices, 
  defaultConfig, 
  defaultWebhookTools 
} from '../../../rtvi.config';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Validate environment variables first
    if (!import.meta.env.DAILY_API_KEY) {
      console.error('Missing DAILY_API_KEY environment variable');
      return new Response(JSON.stringify({ 
        error: 'Server configuration error: Missing Daily API key' 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Following the exact pattern from the Daily Bots demo
    // The RTVIClient automatically sends services, config, and rtvi_client_version
    let requestData;
    try {
      requestData = await request.json();
      console.log('Request data:', JSON.stringify(requestData, null, 2));
    } catch (parseError) {
      console.error('Failed to parse request JSON:', parseError);
      // Even if parsing fails, we'll continue with defaults
      requestData = {};
    }
    
    // Extract services and config from request, with defaults
    const { services = {}, config = [], rtvi_client_version } = requestData;
    
    // Get the base URL for webhooks
    const baseUrl = import.meta.env.PUBLIC_SITE_URL || 'https://www.runportcullis.co';
    
    // Configure webhook tools with the base URL
    const webhookTools: { [key: string]: { url: string } } = {};
    Object.entries(defaultWebhookTools).forEach(([key, tool]) => {
      webhookTools[key] = {
        ...tool,
        url: `${baseUrl}${tool.url}`
      };
    });
    
    // Create the bot configuration - following the Daily Bots demo structure
    const botConfig = {
      bot_profile: defaultBotProfile,
      max_duration: defaultMaxDuration,
      services: { ...defaultServices, ...services },
      config: [...defaultConfig, ...config],
      rtvi_client_version,
      webhook_tools: webhookTools,
    };

    console.log('Sending bot config to Daily API:', JSON.stringify(botConfig, null, 2));

    // Start the bot with improved error handling
    let response;
    try {
      response = await fetch("https://api.daily.co/v1/bots/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.DAILY_API_KEY}`,
        },
        body: JSON.stringify(botConfig),
      });
    } catch (error) {
      console.error('Error making request to Daily.co API:', error);
      return new Response(JSON.stringify({
        error: error instanceof Error ? error.message : 'Error connecting to Daily.co API'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Process the response
    let responseData;
    try {
      responseData = await response.json();
    } catch (error) {
      console.error('Non-JSON response from Daily API:', error);
      return new Response(JSON.stringify({
        error: 'Invalid response from Daily.co API'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (response.status !== 200) {
      console.error("Error starting bot:", responseData);
      return new Response(JSON.stringify(responseData), { 
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Success response
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error: unknown) {
    console.error("Connect API error:", error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
};

// Add OPTIONS handler for CORS preflight requests
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
};