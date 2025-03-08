import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const phoneNumber = data.phoneNumber;

    if (!phoneNumber) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { status: 400 }
      );
    }

    const botConfig = {
      bot_profile: "natural_conversation_2024_11",
      max_duration: 600,
      dialout_settings: [{
        phoneNumber: phoneNumber
      }],
      services: {
        llm: "openai",
        tts: "elevenlabs"
      },
      webhook_tools: {
        get_pricing_info: {
          url: `${import.meta.env.PUBLIC_SITE_URL}/api/bots/webhooks`,
          method: "POST",
          streaming: false
        },
        collect_qualification_info: {
          url: `${import.meta.env.PUBLIC_SITE_URL}/api/bots/webhooks`,
          method: "POST",
          streaming: false
        },
        send_meeting_link: {
          url: `${import.meta.env.PUBLIC_SITE_URL}/api/bots/webhooks`,
          method: "POST",
          streaming: false
        },
        check_interest: {
          url: `${import.meta.env.PUBLIC_SITE_URL}/api/bots/webhooks`,
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
        Authorization: `Bearer ${import.meta.env.DAILY_API_KEY}`,
      },
      body: JSON.stringify(botConfig),
    });

    if (!response.ok) {
      const error = await response.json();
      return new Response(JSON.stringify(error), { status: response.status });
    }

    return new Response(JSON.stringify(await response.json()));
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}; 