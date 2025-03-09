import { renderers } from "../../../renderers.mjs";
const defaultBotProfile = "voice_2024_10";
const defaultMaxDuration = 600;
const LANGUAGES = [
  {
    label: "English",
    value: "en",
    tts_model: "sonic-english",
    stt_model: "nova-2-general",
    default_voice: "79a125e8-cd45-4c13-8a67-188112f4dd22"
  },
  {
    label: "French",
    value: "fr",
    tts_model: "sonic-multilingual",
    stt_model: "nova-2-general",
    default_voice: "a8a1eb38-5f15-4c1d-8722-7ac0f329727d"
  },
  {
    label: "Spanish",
    value: "es",
    tts_model: "sonic-multilingual",
    stt_model: "nova-2-general",
    default_voice: "846d6cb0-2301-48b6-9683-48f5618ea2f6"
  },
  {
    label: "German",
    value: "de",
    tts_model: "sonic-multilingual",
    stt_model: "nova-2-general",
    default_voice: "b9de4a89-2257-424b-94c2-db18ba68c81a"
  }
  /* Not yet supported by Cartesia {
    label: "Portuguese",
    value: "pt",
    tts_model: "sonic-multilingual",
    stt_model: "nova-2-general",
    default_voice: "700d1ee3-a641-4018-ba6e-899dcadc9e2b",
  },
  {
    label: "Chinese",
    value: "zh",
    tts_model: "sonic-multilingual",
    stt_model: "nova-2-general",
    default_voice: "e90c6678-f0d3-4767-9883-5d0ecf5894a8",
  },
  {
    label: "Japanese",
    value: "ja",
    tts_model: "sonic-multilingual",
    stt_model: "nova-2-general",
    default_voice: "2b568345-1d48-4047-b25f-7baccf842eb0",
  },*/
];
const defaultServices = {
  llm: "openai",
  tts: "elevenlabs",
  stt: "deepgram"
};
const defaultLLMPrompt = `You are a friendly onboarding assistant for Portcullis, the navigational advisory consultancy for realtime data engineering helping customers understand our data warehouse steering assistance services and pricing options. Keep your responses concise and natural. Always respond in a conversational tone. Start by greeting the caller and introducing yourself.`;
const defaultConfig = [
  { service: "vad", options: [{ name: "params", value: { stop_secs: 0.5 } }] },
  {
    service: "tts",
    options: [
      { name: "voice", value: "79a125e8-cd45-4c13-8a67-188112f4dd22" },
      { name: "model", value: LANGUAGES[0].tts_model },
      { name: "language", value: LANGUAGES[0].value },
      {
        name: "text_filter",
        value: {
          filter_code: false,
          filter_tables: false
        }
      }
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
            content: defaultLLMPrompt
          }
        ]
      },
      { name: "run_on_config", value: true }
    ]
  },
  {
    service: "stt",
    options: [
      { name: "model", value: LANGUAGES[0].stt_model },
      { name: "language", value: LANGUAGES[0].value }
    ]
  }
];
const webhookTools = {
  get_pricing_info: {
    url: `${"https://www.runportcullis.co"}/api/bots/webhooks`,
    method: "POST",
    streaming: true
  },
  collect_qualification_info: {
    url: `${"https://www.runportcullis.co"}/api/bots/webhooks`,
    method: "POST",
    streaming: true
  },
  send_meeting_link: {
    url: `${"https://www.runportcullis.co"}/api/bots/webhooks`,
    method: "POST",
    streaming: true
  },
  check_interest: {
    url: `${"https://www.runportcullis.co"}/api/bots/webhooks`,
    method: "POST",
    streaming: true
  }
};
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
