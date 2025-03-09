import { renderers } from "../../../renderers.mjs";
const POST = async ({ request }) => {
  try {
    const data = await request.json();
    const phoneNumber = data.phoneNumber;
    if (!phoneNumber) {
      return new Response(
        JSON.stringify({ error: "Phone number is required" }),
        { status: 400 }
      );
    }
    const botConfig = {
      bot_profile: "natural_conversation_2024_11",
      max_duration: 600,
      dialout_settings: [{
        phoneNumber
      }],
      services: {
        llm: "openai",
        tts: "elevenlabs"
      },
      webhook_tools: {
        get_pricing_info: {
          url: `${"https://www.runportcullis.co"}/api/bots/webhooks`,
          method: "POST",
          streaming: false
        },
        collect_qualification_info: {
          url: `${"https://www.runportcullis.co"}/api/bots/webhooks`,
          method: "POST",
          streaming: false
        },
        send_meeting_link: {
          url: `${"https://www.runportcullis.co"}/api/bots/webhooks`,
          method: "POST",
          streaming: false
        },
        check_interest: {
          url: `${"https://www.runportcullis.co"}/api/bots/webhooks`,
          method: "POST",
          streaming: false
        }
      },
      config: [
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
            { name: "model", value: "gpt-4" },
            {
              name: "initial_messages",
              value: JSON.stringify([{
                role: "system",
                content: "You are a friendly onboarding assistant for Portcullis, helping customers understand our data warehouse steering assistance services and pricing options."
              }])
            },
            { name: "temperature", value: "0.7" }
          ]
        }
      ]
    };
    const response = await fetch("https://api.daily.co/v1/bots/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${"d39dcbcb651eb023256551425ed7de9712d6d9abffa2057bde3a5fb62cd34397"}`
      },
      body: JSON.stringify(botConfig)
    });
    if (!response.ok) {
      const error = await response.json();
      return new Response(JSON.stringify(error), { status: response.status });
    }
    return new Response(JSON.stringify(await response.json()));
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
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
