import type { APIRoute } from 'astro';
import twilio from 'twilio';

const twilioClient = twilio(
  import.meta.env.TWILIO_ACCOUNT_SID,
  import.meta.env.TWILIO_AUTH_TOKEN
);

// Pricing and features data
const PRICING_INFO = {
  insights: {
    monthly: "$150/month",
    annual: "$95.50/month",
    features: [
      "Basic steering assistance",
      "Data warehouse health monitoring", 
      "Weekly insights reports",
      "Slack support"
    ]
  },
  insights_plus: {
    monthly: "$510/month", 
    annual: "$433/month",
    features: [
      "Everything in Insights, plus:",
      "Custom dashboard creation",
      "Automated reporting",
      "Priority support",
      "Monthly strategy sessions"
    ]
  },
  gold: {
    monthly: "$4,300/month",
    annual: "$2,795/month", 
    features: [
      "Everything in Insights Plus, plus:",
      "Dedicated data engineer",
      "24/7 support",
      "Custom development",
      "Weekly strategy sessions",
      "Implementation assistance"
    ]
  }
};

interface FunctionCallRequest {
  function_name: string;
  tool_call_id: string;
  arguments: Record<string, any>;
}

type PricingTier = 'insights' | 'insights_plus' | 'gold';
type BillingType = 'monthly' | 'annual';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Handle incoming calls - configure and start bot
    if (data.test || (data.callId && data.callDomain)) {
      return handleIncomingCall(data);
    }

    // Handle function calls from the bot
    if (data.function_name) {
      return handleFunctionCall(data);
    }

    return new Response(
      JSON.stringify({ error: 'Invalid request type' }),
      { status: 400 }
    );
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
};

async function handleIncomingCall(data: any): Promise<Response> {
  if (data.test) {
    return new Response(JSON.stringify({ test: true }));
  }

  const botConfig = {
    bot_profile: "natural_conversation_2024_11",
    max_duration: 600,
    dialin_settings: {
      callId: data.callId,
      callDomain: data.callDomain,
      callerPhone: data.From
    },
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
            value: JSON.stringify([{
              role: "system",
              content: "You are a friendly onboarding assistant for Portcullis, helping customers understand our data warehouse steering assistance services and pricing options. Keep your responses concise and natural. Always respond in a conversational tone."
            }])
          },
          { name: "temperature", value: "0.7" }
        ]
      }
    ],
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
    }
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
}

async function handleFunctionCall(data: FunctionCallRequest): Promise<Response> {
  switch (data.function_name) {
    case 'get_pricing_info':
      return handlePricingInfo(data.arguments);
    case 'collect_qualification_info':
      return handleQualificationInfo(data.arguments);
    case 'send_meeting_link':
      return handleSendMeetingLink(data.arguments);
    case 'check_interest':
      return handleInterestCheck(data.arguments);
    default:
      return new Response(
        JSON.stringify({ error: `Unknown function: ${data.function_name}` }),
        { status: 400 }
      );
  }
}

function handlePricingInfo(args: Record<string, any>): Response {
  const tier = (args.tier?.toLowerCase() || 'insights') as PricingTier;
  const billing = (args.billing_preference || 'monthly') as BillingType;

  if (tier in PRICING_INFO) {
    return new Response(JSON.stringify({
      status: 'success',
      pricing: {
        tier,
        price: PRICING_INFO[tier][billing],
        features: PRICING_INFO[tier].features,
        billing
      }
    }));
  }

  return new Response(
    JSON.stringify({ error: 'Invalid pricing tier' }),
    { status: 400 }
  );
}

async function handleSendMeetingLink(args: Record<string, any>): Promise<Response> {
  const { callerPhone } = args;

  try {
    const message = await twilioClient.messages.create({
      from: '+18444354338',
      to: callerPhone,
      body: `Here is a link to schedule some time with Portcullis: https://cal.com/team/portcullis/portcullis-intro`
    });

    return new Response(JSON.stringify({
      status: 'success',
      messageSid: message.sid
    }));
  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500 }
    );
  }
}


function handleQualificationInfo(args: Record<string, any>): Response {
  try {
    const info = {
      data_warehouse: args.data_warehouse || '',
      team_size: parseInt(args.team_size) || 0,
      project_status: args.project_status || '',
      support_needs: args.support_needs || '',
      billing_preference: args.billing_preference || 'monthly'
    };

    return new Response(JSON.stringify({
      status: 'success',
      qualification_info: info
    }));
  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500 }
    );
  }
}


function handleInterestCheck(args: Record<string, any>): Response {
  return new Response(JSON.stringify({
    status: 'success',
    is_interested: args.is_interested || false
  }));
} 