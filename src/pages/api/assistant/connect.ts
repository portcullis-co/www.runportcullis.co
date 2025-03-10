// src/pages/api/assistant/connect.ts
import type { APIRoute } from 'astro';

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
    
    // Define defaults to use if request is empty
    const defaultServices = {
      llm: "openai",
      tts: "elevenlabs", 
      stt: "deepgram"
    };
    
    const defaultConfig = [
      {
        service: "stt",
        options: [
          { name: "language", value: "en-US" }
        ]
      },
      {
        service: "tts",
        options: [
          { name: "voice", value: "6IlUNt4hAIP1jMBYQncS" },
          { name: "model", value: "eleven_turbo_v2" },
          { name: "output_format", value: "pcm_24000" },
          { name: "stability", value: 0.5 },
          { name: "similarity_boost", value: 0.5 },
          { name: "latency", value: 1 }
        ]
      },
      {
        service: "llm",
        options: [
          { name: "model", value: "gpt-4o-mini" },
          {
            name: "initial_messages",
            value: [
              {
                role: "system",
                content: "You are a friendly assistant for Portcullis, helping users understand our data warehouse steering assistance services. Your job is to help the user understand the services we offer and to collect the information we need to provide a quote."
              }
            ]
          },
          { name: "temperature", value: 0.7 },
          { name: "run_on_config", value: true }
        ]
      }
    ];
    
    // Enhanced error handling for request parsing
    let data;
    try {
      // Try to parse the request, but don't fail if it's empty
      try {
        data = await request.json();
        console.log('Request data received:', JSON.stringify(data));
      } catch (parseError) {
        console.log('Using defaults due to parsing error:', parseError);
        // Continue with empty data if parsing fails
        data = {};
      }
    } catch (error) {
      console.error('Error reading request:', error);
      // Continue with empty data if reading fails
      data = {};
    }
    
    // Extract data from request, falling back to defaults
    const services = data?.services || defaultServices;
    const config = data?.config || defaultConfig;
    const rtvi_client_version = data?.rtvi_client_version || "0.3.3";
    
    // Get the base URL for webhooks
    const baseUrl = import.meta.env.PUBLIC_SITE_URL || 'https://www.runportcullis.co';
    
    // Define webhook tools
    const webhookTools = {
      provide_quote: {
        url: `${baseUrl}/api/assistant/webhooks`,
        method: "POST",
        streaming: false
      },
      collect_qualification_info: {
        url: `${baseUrl}/api/assistant/webhooks`,
        method: "POST",
        streaming: false
      },
      check_interest: {
        url: `${baseUrl}/api/assistant/webhooks`,
        method: "POST",
        streaming: false
      }
    };

    // Simplified configuration
    const botConfig = {
      bot_profile: "voice_2024_08",
      max_duration: 600, // 10 minutes
      services,
      config,
      rtvi_client_version,
      webhook_tools: webhookTools,
      api_keys: {
        openai: import.meta.env.OPENAI_API_KEY,
        elevenlabs: import.meta.env.ELEVENLABS_API_KEY,
      }
    };
    
    console.log('Sending bot config to Daily API:', JSON.stringify(botConfig, null, 2));

    // Start the bot with improved error handling
    let response;
    try {
      const controller = new AbortController();
      // Reduce timeout to avoid Netlify function timeouts (from 10s to 8s)
      const timeoutId = setTimeout(() => controller.abort(), 8000); 
      
      response = await fetch("https://api.daily.co/v1/bots/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.DAILY_API_KEY}`,
        },
        body: JSON.stringify(botConfig),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
    } catch (error) {
      console.error('Error making request to Daily.co API:', error);
      return new Response(JSON.stringify({
        error: error instanceof Error ? error.message : 'Error connecting to Daily.co API',
        details: 'Check server logs for more information'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Handle non-JSON responses
    const responseText = await response.text();
    let responseData;
    
    try {
      // Check if the response text is empty
      if (!responseText || responseText.trim() === '') {
        console.error('Empty response from Daily API');
        return new Response(JSON.stringify({
          error: 'Empty response from Daily.co API',
          status: response.status
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      responseData = JSON.parse(responseText);
    } catch (error) {
      console.error('Non-JSON response from Daily API:', responseText);
      return new Response(JSON.stringify({
        error: 'Invalid response from Daily.co API',
        status: response.status,
        responseText
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (!response.ok) {
      console.error("Error starting bot:", responseData);
      
      // Return a more detailed error response
      return new Response(JSON.stringify({
        error: 'Failed to start Daily.co bot',
        details: responseData,
        status: response.status
      }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    console.log('Bot started successfully, room URL:', responseData.room_url);

    // Add additional metadata to the response
    const enhancedResponse = {
      ...responseData,
      success: true,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(enhancedResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error: unknown) {
    console.error("Connect API error:", error);
    
    // Provide detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error', 
        message: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
        timestamp: new Date().toISOString()
      }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
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