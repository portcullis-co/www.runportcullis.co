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
    console.log('Webhook received:', data);

    // Extract the tool name and parameters
    const { tool_name, parameters } = data;

    let responseData = {};

    // Handle different webhook tools
    switch (tool_name) {
      case 'get_pricing_info':
        responseData = {
          success: true,
          pricing: {
            starter: {
              price: '$499/month',
              features: ['Basic data warehouse monitoring', 'Weekly reports', 'Email support']
            },
            professional: {
              price: '$999/month',
              features: ['Advanced monitoring', 'Daily reports', 'Priority support', 'Custom alerts']
            },
            enterprise: {
              price: 'Custom pricing',
              features: ['Full-service management', '24/7 support', 'Dedicated account manager']
            }
          }
        };
        break;

      case 'collect_qualification_info':
        // Store qualification info if needed
        // This would typically connect to a CRM or database
        responseData = {
          success: true,
          message: 'Information collected successfully'
        };
        break;

      case 'send_meeting_link':
        // In a real implementation, this would send an email or notification
        responseData = {
          success: true,
          meeting_link: 'https://calendly.com/portcullis/demo',
          message: 'Meeting link ready to share'
        };
        break;

      case 'check_interest':
        responseData = {
          success: true,
          message: 'Interest recorded'
        };
        break;

      default:
        return new Response(
          JSON.stringify({ 
            error: 'Unknown tool', 
            message: `Tool '${tool_name}' is not supported` 
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }
        );
    }

    // Return success response
    return new Response(
      JSON.stringify(responseData),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );

  } catch (error: unknown) {
    console.error('Webhook error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error', 
        message: errorMessage 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
};

// Add OPTIONS handler for CORS preflight requests
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
};

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