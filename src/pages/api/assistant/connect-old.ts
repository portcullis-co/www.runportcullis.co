// src/pages/api/assistant/connect.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Validate environment variables first
    if (!import.meta.env.DAILY_API_KEY) {
      console.error('Missing DAILY_API_KEY environment variable');
      return new Response(JSON.stringify({ 
        error: 'Server configuration error: Missing Daily API key' 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Only Hyperline API Key is needed for function calls
    if (!import.meta.env.HYPERLINE_API_KEY) {
      console.error('Missing HYPERLINE_API_KEY environment variable');
      return new Response(JSON.stringify({ 
        error: 'Server configuration error: Missing Hyperline API key' 
      }), {
        status: 500, 
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Parse request data
    let requestData;
    try {
      requestData = await request.json();
      console.log('Request data received:', JSON.stringify(requestData, null, 2));
    } catch (error) {
      console.error('Failed to parse request body:', error);
      requestData = {};
    }
    
    // Get base URL for webhook endpoints
    const baseUrl = import.meta.env.PUBLIC_SITE_URL || 'https://www.runportcullis.co';
    
    // Determine if we're in test mode (sandbox)
    const IS_SANDBOX = import.meta.env.HYPERLINE_ENV === 'sandbox';
    const HYPERLINE_API_BASE = IS_SANDBOX 
      ? 'https://sandbox.api.hyperline.co/v1'
      : 'https://api.hyperline.co/v1';
    const MEETING_LINK = 'https://cal.com/team/portcullis/portcullis-intro';
    
    // Define tools for the LLM - regular tools that will be handled client-side
    const toolDefinitions = [
      {
        name: "schedule_meeting", 
        description: "Schedule a meeting with the customer",
        parameters: {
          type: "object",
          properties: {
            customer_name: {
              type: "string",
              description: "Customer's full name"
            },
            customer_email: {
              type: "string", 
              description: "Customer's email address to send the meeting invite"
            },
            meeting_reason: {
              type: "string",
              description: "Reason for the meeting (demo, consultation, etc.)"
            }
          },
          required: ["customer_email"]
        }
      },
      {
        name: "get_pricing",
        description: "Get current pricing and product offerings",
        parameters: {
          type: "object",
          properties: {
            tier_type: {
              type: "string",
              description: "Optional filter for pricing tier (standard, premium, enterprise)"
            }
          }
        }
      },
      {
        name: "invite_to_slack",
        description: "Invite customer to a Slack Connect channel for onboarding",
        parameters: {
          type: "object",
          properties: {
            customer_name: {
              type: "string",
              description: "Customer's full name"
            },
            customer_email: {
              type: "string",
              description: "Customer's email address to send the Slack invite"
            },
            company_name: {
              type: "string",
              description: "Customer's company name"
            }
          },
          required: ["customer_email"]
        }
      }
    ];
    
    // Simplified configuration to reduce potential errors
    const botConfig = {
      bot_profile: "voice_2024_08",
      max_duration: 600, // 10 minutes
      services: {
        llm: "anthropic",
        tts: "cartesia", 
        stt: "deepgram"
      },
      api_keys: {
        "cartesia": import.meta.env.CARTESIA_API_KEY,
      },
      service_options: {
        anthropic: {
          model: "claude-3-5-sonnet-latest",
          temperature: 0.7,
          max_tokens: 4096
        },
        cartesia: {
          voice: "e81079c7-9159-4f33-bafd-672a27b924c1",
          model: "sonic-english"
        },
        deepgram: {
          language: "en-US"
        }
      },
      config: [
        {
          service: "llm",
          options: [
            {
              name: "model",
              value: "claude-3-5-sonnet-latest"
            },
            {
              name: "temperature",
              value: 0.7
            },
            {
              name: "max_tokens",
              value: 4096
            },
            {
              name: "initial_messages",
              value: [
                {
                  role: "system",
                  content: `You are Portcullis AI Assistant, a friendly, helpful voice agent that assists potential customers with understanding Portcullis's data warehouse steering services. 

Your main responsibilities:
1. Explain Portcullis's services in data warehouse management, optimization, and analytics
2. Answer questions about pricing and service tiers
3. Schedule meetings for demos or consultations
4. Help onboard prospects by inviting them to Slack channels

You have access to the following tools:
- schedule_meeting: Use this to book a meeting with the customer when they express interest in learning more or getting a demo
- get_pricing: Use this to retrieve up-to-date pricing information when customers ask about costs or plans
- invite_to_slack: Use this to onboard a prospect by inviting them to a Slack Connect channel with the team

Always be helpful, professional, and concise. If a customer has questions you can't answer or needs that fall outside your capabilities, offer to connect them with the Portcullis team.

When collecting customer information for meetings or Slack invites, be conversational and explain why you need their email address or other details.`
                }
              ]
            },
            {
              name: "tools",
              value: toolDefinitions
            }
          ]
        },
        {
          service: "tts",
          options: [
            {
              name: "voice",
              value: "e81079c7-9159-4f33-bafd-672a27b924c1"
            },
            {
              name: "model",
              value: "sonic-english"
            }
          ]
        },
        {
          service: "stt",
          options: [
            {
              name: "language",
              value: "en-US"
            }
          ]
        }
      ],
      rtvi_client_version: requestData.rtvi_client_version || '0.3.3',
    };
    
    console.log('Sending bot config to Daily API:', JSON.stringify(botConfig, null, 2));
    
    // Start the bot
    let response; 
    try {
      response = await fetch("https://api.daily.co/v1/bots/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.DAILY_API_KEY}`,
        },
        body: JSON.stringify(botConfig),
      });
    } catch (error) {
      console.error('Error making request to Daily.co API:', error);
      return new Response(JSON.stringify({
        error: error instanceof Error ? error.message : 'Error connecting to Daily.co API'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Process the response
    let responseData;
    try {
      const responseText = await response.text();
      console.log('Daily API response:', responseText);
      responseData = JSON.parse(responseText);
    } catch (error) {
      console.error('Invalid response from Daily API:', error);
      return new Response(JSON.stringify({
        error: 'Invalid response from Daily.co API'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    if (response.status !== 200) {
      console.error('Error starting bot:', responseData);
      return new Response(JSON.stringify(responseData), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Send back only what's needed
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Unhandled error in connect endpoint:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
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