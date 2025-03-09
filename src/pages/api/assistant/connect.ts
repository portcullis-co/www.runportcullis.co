// src/pages/api/assistant/connect.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { services, config, rtvi_client_version } = await request.json();

    // Simple bot configuration
    const botConfig = {
      bot_profile: "natural_conversation_2024_11",
      max_duration: 600,
      services: {
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
            { name: "voice", value: "en-US-Neural2-F" },
            { name: "model", value: "neural2" },
            { name: "language", value: "en-US" }
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
                  content: "You are a friendly assistant for Portcullis, helping customers understand our data warehouse steering assistance services. Keep your responses concise and natural. Always respond in a conversational tone. Start by greeting the user and introducing yourself."
                }
              ]
            },
            { name: "temperature", value: 0.7 },
            { name: "run_on_config", value: true }
          ]
        }
      ],
      rtvi_client_version
    };

    // Call the Daily API to start the bot
    const response = await fetch("https://api.daily.co/v1/bots/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.DAILY_API_KEY}`,
      },
      body: JSON.stringify(botConfig),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Daily API error:", data);
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error: unknown) {
    console.error("Connect endpoint error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', message: errorMessage }), 
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