// src/pages/api/assistant/connect.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { rtvi_client_version, client_info } = data;

    console.log('Connect request received:', { 
      rtvi_client_version, 
      client_info: client_info || 'Not provided'
    });

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
        openai: import.meta.env.OPENAI_API_KEY,
        elevenlabs: import.meta.env.ELEVENLABS_API_KEY,
        deepgram: import.meta.env.DEEPGRAM_API_KEY
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
            // Basic ElevenLabs configuration without extra options that might cause issues
            { name: "voice", value: "6IlUNt4hAIP1jMBYQncS" },
            { name: "model", value: "eleven_turbo_v2" }
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
                  content: "You are a friendly assistant for Portcullis, helping users understand our data warehouse steering assistance services. Keep your responses concise and natural. Always respond in a conversational tone."
                }
              ]
            },
            { name: "temperature", value: 0.7 },
          ]
        }
      ],
      rtvi_client_version,
      webhook_tools: {
        get_pricing_info: {
          url: `${import.meta.env.PUBLIC_SITE_URL || 'https://www.runportcullis.co'}/api/assistant/webhooks`,
          method: "POST",
          streaming: false
        },
        collect_qualification_info: {
          url: `${import.meta.env.PUBLIC_SITE_URL || 'https://www.runportcullis.co'}/api/assistant/webhooks`,
          method: "POST",
          streaming: false
        },
        send_meeting_link: {
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

    console.log('Starting Daily.co bot with configuration:', JSON.stringify(botConfig, null, 2));

    // Start the bot with improved error handling
    const response = await fetch("https://api.daily.co/v1/bots/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.DAILY_API_KEY}`,
      },
      body: JSON.stringify(botConfig),
    });

    // Handle non-JSON responses
    const responseText = await response.text();
    let responseData;
    
    try {
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