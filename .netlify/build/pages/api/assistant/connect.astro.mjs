import { d as defaultServices, a as defaultConfig, w as webhookTools, b as defaultMaxDuration, c as defaultBotProfile } from "../../../chunks/rtvi.config_DBD_TWde.mjs";
import { renderers } from "../../../renderers.mjs";
const POST = async ({ request }) => {
  try {
    const { services, config, rtvi_client_version } = await request.json();
    if (!services || !config || true) {
      return new Response(
        JSON.stringify({ error: "Services or config not found on request body" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
    const mergedServices = {
      ...defaultServices,
      ...services,
      stt: "deepgram",
      tts: "elevenlabs"
    };
    const mergedConfig = [
      ...defaultConfig,
      ...config,
      {
        service: "stt",
        options: [
          { name: "model", value: "deepgram" },
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
      }
    ];
    const payload = {
      bot_profile: defaultBotProfile,
      max_duration: defaultMaxDuration,
      services: mergedServices,
      api_keys: {
        openai: void 0,
        elevenlabs: void 0,
        deepgram: void 0
      },
      config: mergedConfig,
      rtvi_client_version,
      webhook_tools: webhookTools
    };
    const response = await fetch("https://api.daily.co/v1/bots/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${"d39dcbcb651eb023256551425ed7de9712d6d9abffa2057bde3a5fb62cd34397"}`
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: "Internal Server Error", message: errorMessage }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
