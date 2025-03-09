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

    // Configure the bot with improved settings based on Daily Bots documentation
    // But using your preferred services
    const botConfig = {
      bot_profile: "natural_conversation_2024_11",
      max_duration: 1800, // 30 minutes - increased to prevent early termination
      services: {
        // Use your preferred services
        llm: "openai",
        tts: "elevenlabs", // Using ElevenLabs as per your original config
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
            { name: "language", value: "en-US" },
            { name: "model", value: "nova-2" }
          ]
        },
        {
          service: "tts",
          options: [
            // Using your existing ElevenLabs voice ID with improved settings
            { name: "voice", value: "6IlUNt4hAIP1jMBYQncS" },
            { name: "model", value: "eleven_turbo_v2_5" },
            { name: "language", value: "en-US" },
            // Add stability settings for better audio quality
            { name: "stability", value: 0.5 },
            { name: "similarity_boost", value: 0.75 },
            // Add explicit output format to improve compatibility
            { name: "output_format", value: "mp3_44100_128" }
          ]
        },
        {
          service: "llm",
          options: [
            { name: "model", value: "gpt-4o-mini" },
            {
              name: "initial_messages",
              // For OpenAI, the format is different than for Anthropic
              value: [
                {
                  role: "system",
                  content: "You are a friendly assistant for Portcullis, helping users understand our data warehouse steering assistance services. Keep your responses concise and natural. Always respond in a conversational tone. If you encounter any errors or don't understand a question, politely ask for clarification."
                }
              ]
            },
            { name: "temperature", value: 0.7 },  // Changed from string to number
            { name: "run_on_config", value: true }
          ]
        }
      ],
      // Add service-specific options that can improve audio reliability
      service_options: {
        elevenlabs: {
          // Ensure optimal audio output settings
          output_format: "mp3_44100_128",
          latency_optimization: true
        },
        daily: {
          // Improve connection stability with these Daily-specific settings
          audio_bitrate: 128000,
          enable_prejoin_ui: false,
          start_video_off: true,
          start_audio_off: false
        }
      },
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
      },
      // Add Daily.co specific configuration
      daily: {
        // Properties to improve reliability and prevent early termination
        start_audio_off: false,
        start_video_off: true,
        enable_network_ui: false,
        enable_prejoin_ui: false,
        enable_screenshare: false,
        enable_chat: false,
        // Add heartbeat to prevent connection timeouts
        exp_heartbeat_interval: 30,
        // Configure tracks to improve audio quality
        audio_bitrate: 128000,
        audio_processing: true,
        audio_quality_mode: "music"
      },
      heartbeat_interval: 30000 // Send heartbeats every 30 seconds
    };

    console.log('Starting Daily.co bot with configuration');

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
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Non-JSON response from Daily API:', await response.text());
      return new Response(JSON.stringify({
        error: 'Invalid response from Daily.co API',
        status: response.status,
        contentType: contentType || 'unknown'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const responseData = await response.json();

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