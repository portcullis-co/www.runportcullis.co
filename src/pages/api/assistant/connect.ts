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
    
    // Determine if we're in test mode (sandbox)
    const IS_SANDBOX = import.meta.env.HYPERLINE_ENV === 'sandbox';
    const HYPERLINE_API_BASE = IS_SANDBOX 
      ? 'https://sandbox.api.hyperline.co/v1'
      : 'https://api.hyperline.co/v1';
    const MEETING_LINK = 'https://cal.com/team/portcullis/portcullis-intro';
    
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
              name: "tools",
              value: [
                {
                  name: "check_interest",
                  description: "Evaluate and record the customer's interest level in Portcullis services",
                  input_schema: {
                    type: "object",
                    properties: {
                      interest_level: {
                        type: "integer",
                        description: "Interest level on a scale of 1-10, where 10 is extremely interested",
                        minimum: 1,
                        maximum: 10
                      },
                      notes: {
                        type: "string",
                        description: "Brief explanation of why you assessed this interest level"
                      },
                      product: {
                        type: "string",
                        description: "Which product or service the customer seems most interested in",
                        enum: [
                          "Data Warehouse Optimization", 
                          "Data Quality Management", 
                          "Data Security and Governance", 
                          "Advanced Analytics Integration"
                        ]
                      }
                    },
                    required: ["interest_level", "product"]
                  }
                },
                {
                  name: "collect_qualification_info",
                  description: "Trigger collection of customer qualification information via form",
                  input_schema: {
                    type: "object",
                    properties: {
                      trigger_form: {
                        type: "boolean",
                        description: "Set to true to display the customer information form"
                      }
                    },
                    required: ["trigger_form"]
                  }
                },
                {
                  name: "get_products",
                  description: "Retrieve available products from the Portcullis catalog",
                  input_schema: {
                    type: "object",
                    properties: {
                      pricebook_id: {
                        type: "string",
                        description: "ID of the pricebook to retrieve products from",
                        default: "prib_9-PbjlK4BzUSPR"
                      }
                    },
                    required: ["pricebook_id"]
                  }
                },
                {
                  name: "provide_quote",
                  description: "Generate a quote for interested customer after collecting their information",
                  input_schema: {
                    type: "object",
                    properties: {
                      customer_id: {
                        type: "string",
                        description: "ID of the customer, obtained after form submission"
                      },
                      description: {
                        type: "string",
                        description: "Brief description of what services this quote is for"
                      },
                      budget: {
                        type: "string",
                        description: "Optional budget information provided by the customer"
                      }
                    },
                    required: ["customer_id", "description"]
                  }
                }
              ]
            },
            {
              name: "initial_messages",
              value: [
                {
                  role: "system",
                  content: `You are Portcullis AI Assistant, a friendly, helpful voice agent that assists potential customers with understanding Portcullis's data warehouse steering services.

Your primary goals:
1. Explain Portcullis's services clearly and concisely
2. Gauge the customer's interest level in our offerings
3. Collect qualifying information when appropriate
4. Help generate meaningful quotes for interested prospects

Key services to discuss:
- Data Warehouse Optimization: Improving query performance and reducing costs
- Data Quality Management: Ensuring data accuracy and reliability
- Data Security and Governance: Implementing best practices for data protection
- Advanced Analytics Integration: Supporting ML/AI and business intelligence tools

You have access to the following tools:

1. check_interest: Use this to evaluate and record the customer's interest level. When the customer expresses significant interest (level 7+), the system will automatically offer to collect their information via a form.
   - Parameters:
     - interest_level: 1-10 score of how interested the customer seems
     - notes: Brief explanation of why you assessed this interest level
     - product: Which product/service they seem most interested in

2. collect_qualification_info: Use this when a customer shows interest and you need to gather key information.
   - Parameters:
     - trigger_form: Set to true to display the customer information form

3. get_products: Use this to retrieve available products from our catalog.
   - Parameters:
     - pricebook_id: Always use "prib_9-PbjlK4BzUSPR" for the standard Portcullis pricebook

4. provide_quote: Use this after collecting customer information to generate a quote.
   - Parameters:
     - customer_id: The ID of the customer (obtained after form submission)
     - description: Brief description of what services the quote is for
     - budget: Optional budget information from the customer

Guidelines:
- Be natural and conversational, but professional
- Ask open-ended questions to understand the customer's needs
- Avoid overwhelming with technical details unless requested
- If the customer mentions a problem, show empathy and offer relevant solutions
- When you detect significant interest (7+ on a 10-point scale), use the check_interest tool
- Only offer to send a quote when there's clear interest
- If the customer wants to speak with a human, offer to schedule a meeting at ${MEETING_LINK}

You will be interacting through voice, so keep your responses concise and easy to follow in conversation.`
                }
              ]
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