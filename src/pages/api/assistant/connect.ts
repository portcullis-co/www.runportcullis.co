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

    if (!import.meta.env.OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY environment variable');
      return new Response(JSON.stringify({ 
        error: 'Server configuration error: Missing OpenAI API key' 
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
      bot_profile: "natural_conversation_2024_11",
      max_duration: 600, // 10 minutes
      services: {
        // Use OpenAI instead of Anthropic
        llm: "openai",
        tts: "elevenlabs", 
        stt: "deepgram"
      },
      api_keys: {
        "openai": import.meta.env.OPENAI_API_KEY,
      },
      config: [
        {
          service: "tts",
          options: [
            {
              name: "voice",
              value: "6IlUNt4hAIP1jMBYQncS"
            },
            {
              name: "model",
              value: "eleven_turbo_v2"
            },
            {
              name: "output_format",
              value: "pcm_24000"
            }
          ]
        },
        {
          service: "llm",
          options: [
            {
              name: "model",
              value: "gpt-4o" // Using GPT-4o instead of Claude
            },
            {
              name: "temperature",
              value: 0.7
            },
            {
              name: "max_tokens",
              value: 1000
            },
            {
              name: "initial_messages", // Changed from system_prompt to initial_messages for Daily Bots compatibility
              value: [{ // Format changed to array of messages format
                "role": "system",
                "content": `You are a friendly assistant for Portcullis, helping users understand our data warehouse steering assistance services. Your job is to help the user understand the services we offer and to use the tools provided to collect the information we need to provide a quote via the Hyperline API.

Available products and pricing:
1. Content Writing Package (itm_Lwdf42vy6z1voE)
   - 10 blog posts about data engineering topics
   - One-time fee: $5,200

2. Dashboard Creation (itm_DGblPGNRYp9Fu7)
   - Shadcn and Streamlit dashboard for your data warehouse
   - One-time fee: $13,000

3. Insights Advisory (itm_7YYk9dyW1dcWGg)
   - Ongoing steering support for realtime data engineering
   - Monthly: $97.50 or Annual: $1,170

4. Realtime Voice AI Build (itm_rjHTRIERIpOUnQ)
   - Custom realtime voice AI solution
   - One-time fee: $23,000

5. Steering Report (itm__kaVtWZoXa0olZ)
   - POC planning and build/buy analysis
   - One-time fee: $1,200

Use the available functions to collect customer information and create quotes based on their needs. Match their requirements to the most suitable product(s).`
              }]
            },
            {
              name: "tools", // Changed from "functions" to "tools" for Daily Bots compatibility
              value: [
                {
                  name: "get_products",
                  description: "Get available products and their details from Hyperline",
                  input_schema: { // Using Anthropic/Daily Bots format for tools
                    type: "object",
                    properties: {
                      filter: {
                        type: "string",
                        enum: ["all", "subscription", "one_off"],
                        description: "Filter products by type"
                      }
                    }
                  },
                  function_exec_info: {
                    endpoint: `${HYPERLINE_API_BASE}/products`,
                    method: "GET",
                    headers: {
                      "Authorization": `Bearer ${import.meta.env.HYPERLINE_API_KEY}`,
                      "Content-Type": "application/json"
                    }
                  }
                },
                {
                  name: "create_customer",
                  description: "Create a new customer in Hyperline",
                  input_schema: { // Using Anthropic/Daily Bots format for tools
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description: "Customer's full name"
                      },
                      email: {
                        type: "string",
                        description: "Customer's email address"
                      },
                      company_name: {
                        type: "string",
                        description: "Customer's company name"
                      },
                      phone: {
                        type: "string",
                        description: "Customer's phone number"
                      },
                      custom_properties: {
                        type: "object",
                        properties: {
                          data_warehouse: { 
                            type: "string",
                            description: "Type of data warehouse being used"
                          },
                          project_status: { 
                            type: "string",
                            description: "Current status of the project (e.g., planning, ongoing, etc.)"
                          },
                          team_size: { 
                            type: "integer",
                            description: "Size of the team working on the project"
                          },
                          requirements: { 
                            type: "string",
                            description: "Comma-separated list of project requirements"
                          }
                        }
                      },
                      metadata: {
                        type: "object",
                        description: "Additional metadata about the customer",
                        properties: {
                          source: {
                            type: "string",
                            default: "voice_assistant"
                          }
                        }
                      }
                    },
                    required: ["name", "email"]
                  },
                  function_exec_info: {
                    endpoint: `${HYPERLINE_API_BASE}/customers`,
                    method: "POST",
                    headers: {
                      "Authorization": `Bearer ${import.meta.env.HYPERLINE_API_KEY}`,
                      "Content-Type": "application/json"
                    }
                  }
                },
                {
                  name: "create_quote",
                  description: "Create a quote in Hyperline",
                  input_schema: { // Using Anthropic/Daily Bots format for tools
                    type: "object",
                    properties: {
                      customer_id: {
                        type: "string",
                        description: "Customer ID from create_customer"
                      },
                      type: {
                        type: "string",
                        enum: ["subscription", "one_off"],
                        description: "Type of quote"
                      },
                      status: {
                        type: "string",
                        enum: ["draft", "sent"],
                        default: "draft"
                      },
                      owner_email: {
                        type: "string",
                        default: "james@runportcullis.co"
                      },
                      comments: {
                        type: "string",
                        description: "Additional comments or notes about the quote"
                      },
                      terms: {
                        type: "string",
                        default: "By signing this quote, you accept our terms of service."
                      },
                      products: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            name: { type: "string" },
                            description: { type: "string" },
                            price: { 
                              type: "integer",
                              description: "Price in cents"
                            },
                            quantity: { type: "integer", default: 1 }
                          }
                        }
                      },
                      subscription: {
                        type: "object",
                        properties: {
                          commitment_interval: {
                            type: "object",
                            properties: {
                              period: { type: "string", enum: ["months", "years"] },
                              count: { type: "integer", default: 1 }
                            }
                          },
                          renew_automatically: { type: "boolean", default: true }
                        }
                      },
                      collect_payment_details: { type: "boolean", default: true },
                      automatically_start_subscription: { type: "boolean", default: true },
                      metadata: {
                        type: "object",
                        description: "Additional metadata about the quote",
                        properties: {
                          source: {
                            type: "string",
                            default: "voice_assistant"
                          }
                        }
                      }
                    },
                    required: ["customer_id", "type", "products"]
                  },
                  function_exec_info: {
                    endpoint: `${HYPERLINE_API_BASE}/quotes`,
                    method: "POST",
                    headers: {
                      "Authorization": `Bearer ${import.meta.env.HYPERLINE_API_KEY}`,
                      "Content-Type": "application/json"
                    }
                  }
                },
                {
                  name: "send_quote",
                  description: "Send a quote to the customer",
                  input_schema: { // Using Anthropic/Daily Bots format for tools
                    type: "object",
                    properties: {
                      quote_id: {
                        type: "string",
                        description: "Quote ID from create_quote"
                      },
                      email: {
                        type: "string",
                        description: "Customer's email address"
                      },
                      subject: {
                        type: "string",
                        description: "Email subject line"
                      },
                      message: {
                        type: "string",
                        description: "Email message body"
                      }
                    },
                    required: ["quote_id", "email", "subject", "message"]
                  },
                  function_exec_info: {
                    endpoint: `${HYPERLINE_API_BASE}/quotes/{quote_id}/send`,
                    method: "POST",
                    headers: {
                      "Authorization": `Bearer ${import.meta.env.HYPERLINE_API_KEY}`,
                      "Content-Type": "application/json"
                    }
                  }
                }
              ]
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
      rtvi_client_version: requestData.rtvi_client_version || '1.0.0',
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
      console.log('Daily API response status:', response.status);
      // Convert headers to object safely without using .entries()
      const headerObj: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headerObj[key] = value;
      });
      console.log('Daily API response headers:', headerObj);
      console.log('Daily API response body:', responseText);
      
      responseData = JSON.parse(responseText);
      
      // Log specific error information if present
      if (response.status !== 200) {
        console.error('Daily API error details:');
        console.error('- Error type:', responseData.error || 'None');
        console.error('- Error message:', responseData.error_msg || responseData.message || 'None');
        console.error('- Error details:', responseData.details || 'None');
      } else {
        console.log('Daily API bot start successful - Bot ID:', responseData.id || 'Unknown');
        console.log('Daily API connection info provided:', !!responseData.connection_info);
      }
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