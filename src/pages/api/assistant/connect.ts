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

    // Only Hyperline API Key is needed for function calls
    if (!import.meta.env.HYPERLINE_API_KEY) {
      console.error('Missing HYPERLINE_API_KEY environment variable');
      return new Response(JSON.stringify({ 
        error: 'Server configuration error: Missing Hyperline API key' 
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
    
    // Determine if we're in test mode (sandbox)
    const IS_SANDBOX = import.meta.env.HYPERLINE_ENV === 'sandbox';
    const HYPERLINE_API_BASE = IS_SANDBOX 
      ? 'https://sandbox.api.hyperline.co/v1'
      : 'https://api.hyperline.co/v1';
    const MEETING_LINK = 'https://cal.com/team/portcullis/portcullis-intro';
    
    // Simplified configuration to reduce potential errors
    const botConfig = {
      bot_profile: "voice_2024_08",
      max_duration: 600, // 10 minutes
      services: {
        llm: "anthropic",
        tts: "cartesia", 
        stt: "deepgram"
      },
      api_keys: {
        "cartesia": import.meta.env.CARTESIA_API_KEY,
      },
      service_options: {
        anthropic: {
          model: "claude-3-5-sonnet-latest",
          temperature: 0.7,
          max_tokens: 4096
        },
        cartesia: {
          voice: "e81079c7-9159-4f33-bafd-672a27b924c1",
          model: "sonic-english"
        },
        deepgram: {
          language: "en-US"
        }
      },
      config: [
        {
          service: "llm",
          options: [
            {
              name: "model",
              value: "claude-3-5-sonnet-latest"
            },
            {
              name: "temperature",
              value: 0.7
            },
            {
              name: "max_tokens",
              value: 4096
            },
            {
              name: "initial_messages",
              value: [
                {
                  role: "system",
                  content: ``
                }
              ]
            }
          ]
        },
        {
          service: "tts",
          options: [
            {
              name: "voice",
              value: "e81079c7-9159-4f33-bafd-672a27b924c1"
            },
            {
              name: "model",
              value: "sonic-english"
            }
          ]
        },
        {
          service: "stt",
          options: [
            {
              name: "language",
              value: "en-US"
            }
          ]
        }
      ],
      rtvi_client_version: requestData.rtvi_client_version || '0.3.3',
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