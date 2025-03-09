// src/pages/api/assistant/connect.ts
import type { APIRoute } from 'astro';
import {
  defaultBotProfile,
  defaultMaxDuration,
  defaultServices,
  defaultConfig,
  webhookTools
} from "../../../../rtvi.config";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { services, config, rtvi_client_version } = await request.json();

    if (!services || !config || !import.meta.env.DAILY_BOTS_URL) {
      return new Response(
        JSON.stringify({ error: 'Services or config not found on request body' }), 
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Merge incoming services and config with defaults
    const mergedServices = {
      ...defaultServices,
      ...services,
      stt: "deepgram",
      tts: "elevenlabs",
    };

    const mergedConfig = [
      ...defaultConfig,
      ...config,
      {
        service: "stt",
        options: [
          { name: "model", value: "deepgram" },
          { name: "language", value: "en-US" },
        ],
      },
      {
        service: "tts",
        options: [
          { name: "voice", value: "en-US-Neural2-F" },
          { name: "model", value: "neural2" },
          { name: "language", value: "en-US" },
        ],
      },
    ];

    const payload = {
      bot_profile: defaultBotProfile,
      max_duration: defaultMaxDuration,
      services: mergedServices,
      api_keys: {
        openai: import.meta.env.OPENAI_API_KEY,
        elevenlabs: import.meta.env.ELEVENLABS_API_KEY,
        deepgram: import.meta.env.DEEPGRAM_API_KEY,
      },
      config: mergedConfig,
      rtvi_client_version,
      webhook_tools: webhookTools,
    };

    const response = await fetch("https://api.daily.co/v1/bots/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.DAILY_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', message: errorMessage }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};