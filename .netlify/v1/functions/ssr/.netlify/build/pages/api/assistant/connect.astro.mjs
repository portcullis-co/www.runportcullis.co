import { renderers } from "../../../renderers.mjs";
const POST = async ({ request }) => {
  try {
    if (false) ;
    const missingKeys = [];
    if (true) missingKeys.push("OPENAI_API_KEY");
    if (true) missingKeys.push("ELEVENLABS_API_KEY");
    if (true) missingKeys.push("DEEPGRAM_API_KEY");
    if (missingKeys.length > 0) {
      console.error(`Missing environment variables: ${missingKeys.join(", ")}`);
      return new Response(JSON.stringify({
        error: `Server configuration error: Missing ${missingKeys.join(", ")}`
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const data = await request.json();
    const { client} = data;
    console.log("Connect request received:", {
      client
    });
    const botConfig = {
      bot_profile: "natural_conversation_2024_11",
      max_duration: 600,
      // 10 minutes
      services: {
        // Use your preferred services
        llm: "openai",
        tts: "elevenlabs",
        stt: "deepgram"
      },
      api_keys: {
        openai: void 0,
        elevenlabs: void 0,
        deepgram: void 0
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
            { name: "temperature", value: 0.7 }
          ]
        }
      ],
      rtvi_client_version,
      webhook_tools: {
        provide_quote: {
          url: `${"https://www.runportcullis.co"}/api/assistant/webhooks`,
          method: "POST",
          streaming: false
        },
        collect_qualification_info: {
          url: `${"https://www.runportcullis.co"}/api/assistant/webhooks`,
          method: "POST",
          streaming: false
        },
        check_interest: {
          url: `${"https://www.runportcullis.co"}/api/assistant/webhooks`,
          method: "POST",
          streaming: false
        }
      }
    };
    console.log("Starting Daily.co bot with configuration:", JSON.stringify(botConfig, null, 2));
    let response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1e4);
      response = await fetch("https://api.daily.co/v1/bots/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${"d39dcbcb651eb023256551425ed7de9712d6d9abffa2057bde3a5fb62cd34397"}`
        },
        body: JSON.stringify(botConfig),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch (error) {
      console.error("Error making request to Daily.co API:", error);
      return new Response(JSON.stringify({
        error: error instanceof Error ? error.message : "Error connecting to Daily.co API",
        details: "Check server logs for more information"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (error) {
      console.error("Non-JSON response from Daily API:", responseText);
      return new Response(JSON.stringify({
        error: "Invalid response from Daily.co API",
        status: response.status,
        responseText
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    if (!response.ok) {
      console.error("Error starting bot:", responseData);
      return new Response(JSON.stringify({
        error: "Failed to start Daily.co bot",
        details: responseData,
        status: response.status
      }), {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    console.log("Bot started successfully, room URL:", responseData.room_url);
    const enhancedResponse = {
      ...responseData,
      success: true,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    return new Response(JSON.stringify(enhancedResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  } catch (error) {
    console.error("Connect API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    const errorStack = error instanceof Error ? error.stack : void 0;
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: errorMessage,
        stack: process.env.NODE_ENV === "development" ? errorStack : void 0,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        }
      }
    );
  }
};
const OPTIONS = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
