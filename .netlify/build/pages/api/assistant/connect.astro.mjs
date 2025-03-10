import { renderers } from "../../../renderers.mjs";
const POST = async ({ request }) => {
  try {
    if (false) ;
    let data;
    try {
      data = await request.json();
    } catch (parseError) {
      console.error("Failed to parse request JSON:", parseError);
      return new Response(JSON.stringify({
        error: "Invalid JSON in request body"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const { client } = data;
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
      rtvi_client_version: client.rtvi_client_version,
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
    let response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8e3);
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
        error: error instanceof Error ? error.message : "Error connecting to Daily.co API"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    let responseData;
    try {
      const responseText = await response.text();
      responseData = JSON.parse(responseText);
    } catch (error) {
      console.error("Non-JSON response from Daily API:", error);
      return new Response(JSON.stringify({
        error: "Invalid response from Daily.co API"
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
        details: responseData
      }), {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    return new Response(JSON.stringify({
      ...responseData,
      success: true
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  } catch (error) {
    console.error("Connect API error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
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
