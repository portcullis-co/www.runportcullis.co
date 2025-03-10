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

    if (!import.meta.env.OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY environment variable');
      return new Response(JSON.stringify({ 
        error: 'Server configuration error: Missing OpenAI API key' 
      }), {
        status: 500, 
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Parse request data
    let requestData;
    try {
      requestData = await request.json();
      console.log('Request data received:', JSON.stringify(requestData, null, 2));
    } catch (error) {
      console.error('Failed to parse request body:', error);
      requestData = {};
    }
    
    // Define the services
    const services = {
      llm: "openai",
      tts: "elevenlabs", 
      stt: "deepgram"
    };
    
    // Simplified configuration to reduce potential errors
    const botConfig = {
      bot_profile: "natural_conversation_2024_11",
      max_duration: 600, // 10 minutes
      services: {
        // Use your preferred services
        llm: "openai",
        tts: "elevenlabs", 
        stt: "deepgram"
      },
      api_keys: {
        "openai" : import.meta.env.OPENAI_API_KEY,
      },
      config: [
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
                  content: "You are a friendly assistant for Portcullis, helping users understand our data warehouse steering assistance services. Your job is to help the user understand the services we offer and to collect the information we need to provide a quote. You should call the 'check_interest' tool to guage the user's interest and then call the 'provide_quote' tool to provide a quote. You should also call the 'collect_qualification_info' tool to collect the information we need to provide a quote."
                }
              ]
            },
            { name: "temperature", value: 0.7 },
          ]
        }
      ],
      rtvi_client_version: requestData.rtvi_client_version || '1.0.0',
      webhook_tools: {
        provide_quote: {
          url: `${import.meta.env.PUBLIC_SITE_URL || 'https://www.runportcullis.co'}/api/assistant/webhooks`,
          method: "POST",
          streaming: false
        },
        collect_qualification_info: {
          url: `${import.meta.env.PUBLIC_SITE_URL || 'https://www.runportcullis.co'}/api/assistant/webhooks`,
          method: "POST",
          streaming: false
        },
        check_interest: {
          url: `${import.meta.env.PUBLIC_SITE_URL || 'https://www.runportcullis.co'}/api/assistant/webhooks`,
          method: "POST",
          streaming: false
        }
      }
    };
    
    console.log('Sending bot config to Daily API:', JSON.stringify(botConfig, null, 2));
    
    // Start the bot
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
      const responseText = await response.text();
      console.log('Daily API response:', responseText);
      responseData = JSON.parse(responseText);
    } catch (error) {
      console.error('Invalid response from Daily API:', error);
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
      console.error('Error starting bot:', responseData);
      return new Response(JSON.stringify(responseData), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Send back only what's needed
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Unhandled error in connect endpoint:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
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