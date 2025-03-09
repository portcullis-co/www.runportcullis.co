// [POST] /api
import {
  defaultBotProfile,
  defaultMaxDuration,
  defaultServices,
  defaultConfig,
  webhookTools
} from "../../../../rtvi.config";

export async function POST(request: Request) {
  const { services, config, rtvi_client_version } = await request.json();

  if (!services || !config || !import.meta.env.DAILY_BOTS_URL) {
    return new Response(`Services or config not found on request body`, {
      status: 400,
    });
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
    webhook_tools: webhookTools, // Include webhook tools if needed
  };

  const req = await fetch(import.meta.env.DAILY_BOTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.DAILY_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const res = await req.json();

  if (req.status !== 200) {
    return Response.json(res, { status: req.status });
  }

  return Response.json(res);
}