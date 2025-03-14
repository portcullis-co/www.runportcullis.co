// [POST] /api
import type { APIRoute } from "astro";
import {
  defaultBotProfile,
  defaultMaxDuration,
  defaultServices,
} from "../../../rtvi.config";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { services, config, rtvi_client_version } = body;

    // Provide more specific error messages
    const missingParams = [];
    if (!services) missingParams.push("services");
    if (!config) missingParams.push("config");
    if (!import.meta.env.DAILY_BOTS_API_KEY) missingParams.push("DAILY_BOTS_API_KEY environment variable");

    if (missingParams.length > 0) {
      const errorMessage = `Missing required parameters: ${missingParams.join(", ")}`;
      console.error(errorMessage);
      return new Response(errorMessage, {
        status: 400,
        headers: { "Content-Type": "text/plain" }
      });
    }

    console.log("Creating bot with payload:", {
      services,
      config: config.map((c: any) => `${c.service}: ${c.options.map((o: any) => o.name).join(", ")}`),
      rtvi_client_version
    });

    const payload = {
      bot_profile: defaultBotProfile,
      max_duration: defaultMaxDuration,
      services: { ...defaultServices, ...services },
      api_keys: {
        openai: import.meta.env.OPENAI_API_KEY,
        grok: import.meta.env.GROK_API_KEY,
        gemini: import.meta.env.GEMINI_API_KEY,
      },
      config: [...config],
      rtvi_client_version,
    };

    const req = await fetch(import.meta.env.DAILY_BOTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.DAILY_BOTS_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    let res;
    try {
      res = await req.json();
    } catch (error) {
      const text = await req.text();
      console.error("Failed to parse response as JSON:", text);
      return new Response(`API returned invalid JSON: ${text}`, {
        status: 500,
        headers: { "Content-Type": "text/plain" }
      });
    }

    if (req.status !== 200) {
      console.error("API returned error:", res);
      return new Response(JSON.stringify({
        error: "Failed to create bot session",
        details: res,
        status: req.status
      }), { 
        status: req.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to process request",
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}