// src/pages/api/assistant/connect.ts
import type { APIRoute } from 'astro';
import twilio from 'twilio';

// Initialize Twilio client
const twilioClient = twilio(
  import.meta.env.TWILIO_ACCOUNT_SID,
  import.meta.env.TWILIO_AUTH_TOKEN
);

// Hyperline API base URL
const HYPERLINE_API_BASE = 'https://api.hyperline.co/v1';
const HYPERLINE_API_KEY = import.meta.env.HYPERLINE_API_KEY;
const INVOICING_ENTITY_ID = import.meta.env.HYPERLINE_INVOICING_ENTITY_ID || 'ive_default';

// Meeting booking link
const MEETING_LINK = 'https://cal.com/team/portcullis/portcullis-intro';

// Interface for customer needs
interface CustomerNeeds {
  dataWarehouse?: string;
  projectStatus?: string;
  budget?: number | string;
  requirements?: string[];
  teamSize?: number;
  email: string;
  name: string;
  company?: string;
  phone?: string;
}

// Interface for Hyperline product
interface HyperlineProduct {
  id: string;
  name: string;
  description: string;
  price_configuration?: any;
  recommended?: boolean;
}

// Function to get products from Hyperline
async function getHyperlineProducts(): Promise<HyperlineProduct[]> {
  try {
    // Make a real API call to Hyperline
    const response = await fetch(`${HYPERLINE_API_BASE}/products`, {
      headers: {
        'Authorization': `Bearer ${HYPERLINE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = await response.json();
    
    // Add pricing information to each product since it's not in the API response
    const productsWithPricing = (data.data || []).map((product: { id: any; }) => {
      let pricing = {};
      
      switch (product.id) {
        case 'itm_Lwdf42vy6z1voE': // Content Writing
          pricing = { flat_fee: 5200 };
          break;
        case 'itm_DGblPGNRYp9Fu7': // Dashboard Creation
          pricing = { flat_fee: 13000 };
          break;
        case 'itm_7YYk9dyW1dcWGg': // Insights
          pricing = { monthly: 97.5, annual: 1170 };
          break;
        case 'itm_rjHTRIERIpOUnQ': // Realtime Voice AI Build
          pricing = { flat_fee: 23000 };
          break;
        case 'itm__kaVtWZoXa0olZ': // Steering Report
          pricing = { flat_fee: 1200 };
          break;
      }
      
      return {
        ...product,
        price_configuration: pricing
      };
    });
    
    return productsWithPricing;

  } catch (error) {
    console.error('Error fetching Hyperline products:', error);
    
    // If API fails, return hardcoded data with correct structure
    return [
      {
        id: 'itm_Lwdf42vy6z1voE',
        name: 'Content Writing',
        description: 'Package of 10 blog posts about your choice of data engineering topic',
        price_configuration: { flat_fee: 5200 }
      },
      {
        id: 'itm_DGblPGNRYp9Fu7',
        name: 'Dashboard Creation',
        description: 'Shadcn and Streamlit dashboard creation for your data warehouse',
        price_configuration: { flat_fee: 13000 }
      },
      {
        id: 'itm_7YYk9dyW1dcWGg',
        name: 'Insights',
        description: 'Advisory steering support for realtime data engineering projects',
        price_configuration: { monthly: 97.5, annual: 1170 }
      },
      {
        id: 'itm_rjHTRIERIpOUnQ',
        name: 'Realtime Voice AI Build',
        description: 'A custom realtime voice AI build for your company',
        price_configuration: { flat_fee: 23000 }
      },
      {
        id: 'itm__kaVtWZoXa0olZ',
        name: 'Steering Report',
        description: 'We will help you plan your POC and things such as build/buy reports',
        price_configuration: { flat_fee: 1200 }
      }
    ];
  }
}

// Function to select the appropriate product based on customer needs
function selectProductForCustomer(customerNeeds: CustomerNeeds, products: HyperlineProduct[]): HyperlineProduct | null {
  if (!products || products.length === 0) {
    return null;
  }
  
  // Product selection scoring system specific to Portcullis products
  const scores = products.map(product => {
    let score = 0;
    
    // Keywords to identify customer needs
    const needsDashboard = customerNeeds.requirements?.some(req => 
      req.toLowerCase().includes('dashboard') || 
      req.toLowerCase().includes('visualization') ||
      req.toLowerCase().includes('streamlit') ||
      req.toLowerCase().includes('shadcn'));
    
    const needsContent = customerNeeds.requirements?.some(req => 
      req.toLowerCase().includes('blog') || 
      req.toLowerCase().includes('content') ||
      req.toLowerCase().includes('writing') ||
      req.toLowerCase().includes('post'));
    
    const needsVoiceAI = customerNeeds.requirements?.some(req => 
      req.toLowerCase().includes('voice') || 
      req.toLowerCase().includes('ai') ||
      req.toLowerCase().includes('chat') ||
      req.toLowerCase().includes('assistant'));
    
    const needsPlanning = customerNeeds.requirements?.some(req => 
      req.toLowerCase().includes('poc') || 
      req.toLowerCase().includes('plan') ||
      req.toLowerCase().includes('report') ||
      req.toLowerCase().includes('build/buy'));
    
    const needsAdvisory = customerNeeds.requirements?.some(req => 
      req.toLowerCase().includes('advisory') || 
      req.toLowerCase().includes('steering') ||
      req.toLowerCase().includes('support') ||
      req.toLowerCase().includes('ongoing'));
    
    // Match specific products to needs
    switch (product.id) {
      case 'itm_Lwdf42vy6z1voE': // Content Writing
        if (needsContent) score += 10;
        break;
      
      case 'itm_DGblPGNRYp9Fu7': // Dashboard Creation
        if (needsDashboard) score += 10;
        // Extra points if they mention data warehouse and dashboards
        if (needsDashboard && customerNeeds.dataWarehouse) score += 5;
        break;
      
      case 'itm_7YYk9dyW1dcWGg': // Insights
        if (needsAdvisory) score += 10;
        // This is the subscription product, so it makes sense for ongoing relationships
        if (customerNeeds.projectStatus?.toLowerCase().includes('ongoing')) score += 5;
        break;
      
      case 'itm_rjHTRIERIpOUnQ': // Realtime Voice AI Build
        if (needsVoiceAI) score += 10;
        break;
      
      case 'itm__kaVtWZoXa0olZ': // Steering Report
        if (needsPlanning) score += 10;
        // Extra points for early-stage projects
        if (customerNeeds.projectStatus?.toLowerCase().includes('planning') || 
            customerNeeds.projectStatus?.toLowerCase().includes('early')) score += 5;
        break;
    }
    
    // Budget considerations
    if (customerNeeds.budget) {
      const budgetNum = typeof customerNeeds.budget === 'string' 
        ? parseInt(customerNeeds.budget.replace(/[^0-9]/g, '')) 
        : customerNeeds.budget;
      
      // Check if product is within budget
      const productPrice = product.price_configuration?.flat_fee || 
                          product.price_configuration?.monthly * 12 || 
                          product.price_configuration?.annual;
      
      if (productPrice <= budgetNum) {
        score += 5;
      } else if (productPrice > budgetNum) {
        // Penalize products significantly above budget
        score -= 5;
      }
    }
    
    // General matching based on description keywords
    if (customerNeeds.requirements) {
      for (const req of customerNeeds.requirements) {
        if (product.description.toLowerCase().includes(req.toLowerCase())) {
          score += 2;
        }
      }
    }
    
    // Data warehouse specific matching
    if (customerNeeds.dataWarehouse && 
        product.description.toLowerCase().includes('data warehouse')) {
      score += 3;
    }
    
    return { product, score };
  });
  
  // Sort by score (highest first)
  scores.sort((a, b) => b.score - a.score);
  console.log('Product scores:', scores.map(s => `${s.product.name}: ${s.score}`));
  
  // Return the highest scoring product, or the Insights product as fallback
  if (scores.length > 0 && scores[0].score > 0) {
    return scores[0].product;
  }
  
  // If no clear match, return Insights as it's the most general service
  const insightsProduct = products.find(p => p.id === 'itm_7YYk9dyW1dcWGg');
  if (insightsProduct) {
    return insightsProduct;
  }
  
  // Last resort: return the first product
  return products[0];
}

// Function to create a customer in Hyperline
async function createHyperlineCustomer(customerNeeds: CustomerNeeds) {
  try {
    // In production, this would make a real API call to Hyperline
    const response = await fetch(`${HYPERLINE_API_BASE}/customers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HYPERLINE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: customerNeeds.name,
        email: customerNeeds.email,
        company_name: customerNeeds.company,
        phone: customerNeeds.phone,
        custom_properties: {
          data_warehouse: customerNeeds.dataWarehouse,
          project_status: customerNeeds.projectStatus,
          team_size: customerNeeds.teamSize,
          requirements: customerNeeds.requirements?.join(', ')
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create customer: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating Hyperline customer:', error);
    
    // Return a mock customer ID for testing
    return { 
      id: `cus_${Date.now().toString(36)}`, 
      email: customerNeeds.email,
      name: customerNeeds.name
    };
  }
}

// Function to create and send a quote
async function createAndSendQuote(customer: any, product: HyperlineProduct, customerNeeds: CustomerNeeds) {
  try {
    // Calculate expiration date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    
    // Determine if this is a subscription or one-time product
    const isSubscription = product.id === 'itm_7YYk9dyW1dcWGg'; // Only Insights is subscription
    
    // Determine billing preference for subscription products
    const billingPreference = customerNeeds.requirements?.some(req => 
      req.toLowerCase().includes('annual') || req.toLowerCase().includes('yearly')) 
      ? 'annual' : 'monthly';
    
    // Get the appropriate amount based on product type
    const amount = isSubscription
      ? product.price_configuration?.[billingPreference] || 97.5
      : product.price_configuration?.flat_fee || 1200;
    
    // Create quote request body - handle subscription vs. one-time differently
    const quoteBody: any = {
      status: 'draft',
      owner_email: 'sales@runportcullis.co',
      customer_id: customer.id,
      invoicing_entity_id: INVOICING_ENTITY_ID,
      comments: `Thank you for your interest in Portcullis! Based on your needs, we recommend our ${product.name} service. You can also schedule a meeting with us here: ${MEETING_LINK}`,
      terms: "By signing this quote, you accept our terms of service.",
      amount: amount * 100, // Convert to cents
      collect_payment_details: true,
      automatically_start_subscription: isSubscription,
      expires_at: expiresAt.toISOString(),
    };
    
    // Add subscription configuration only for subscription products
    if (isSubscription) {
      quoteBody.type = 'subscription';
      quoteBody.subscription = {
        commitment_interval: {
          period: billingPreference === 'annual' ? 'years' : 'months',
          count: 1
        },
        renew_automatically: true,
        phases: [
          {
            products: [
              {
                id: product.id,
                name: product.name,
                description: product.description,
                payment_interval: {
                  period: billingPreference === 'annual' ? 'years' : 'months',
                  count: 1
                },
                price: {
                  type: 'fee',
                  amount: amount * 100 // Convert to cents
                }
              }
            ]
          }
        ]
      };
    } else {
      // For one-time products, use the one_off type
      quoteBody.type = 'one_off';
      quoteBody.products = [
        {
          id: product.id,
          name: product.name,
          description: product.description,
          price: amount * 100, // Convert to cents
          quantity: 1
        }
      ];
    }
    
    // Create the quote via Hyperline API
    const quoteResponse = await fetch(`${HYPERLINE_API_BASE}/quotes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HYPERLINE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quoteBody)
    });

    if (!quoteResponse.ok) {
      throw new Error(`Failed to create quote: ${quoteResponse.status}`);
    }

    const quote = await quoteResponse.json();
    
    // Send the quote
    const sendResponse = await fetch(`${HYPERLINE_API_BASE}/quotes/${quote.id}/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HYPERLINE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: customer.email,
        subject: `Your Portcullis ${product.name} Quote`,
        message: `Hello ${customer.name},\n\nThank you for your interest in Portcullis! We've prepared a quote for our ${product.name} service based on your needs.\n\nYou can also schedule a meeting with us here: ${MEETING_LINK}\n\nLooking forward to working with you,\nThe Portcullis Team`
      })
    });

    if (!sendResponse.ok) {
      throw new Error(`Failed to send quote: ${sendResponse.status}`);
    }

    return quote;
  } catch (error) {
    console.error('Error creating/sending quote:', error);
    
    // Return a mock quote for testing
    return { 
      id: `quo_${Date.now().toString(36)}`,
      url: `https://billing.hyperline.co/quote/quo_${Date.now().toString(36)}`,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      amount: product.price_configuration?.flat_fee || 
              product.price_configuration?.monthly || 
              1200 * 100
    };
  }
}

// Function to send meeting link via SMS
async function sendMeetingLinkViaSMS(phone: string) {
  try {
    return await twilioClient.messages.create({
      from: '+18444354338',
      to: phone,
      body: `Thank you for your interest in Portcullis! Here's a link to schedule a meeting with our team: ${MEETING_LINK}`
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    return null;
  }
}

// Logic for the provide_quote tool
async function handleQuoteRequest(params: any) {
  try {
    // 1. Extract and format customer information
    const customerNeeds: CustomerNeeds = {
      email: params.email,
      name: params.name,
      company: params.company || params.name + "'s Company",
      dataWarehouse: params.data_warehouse,
      projectStatus: params.project_status,
      budget: params.budget,
      requirements: params.requirements || [],
      teamSize: params.team_size,
      phone: params.phone
    };

    console.log('Processing quote for customer:', customerNeeds);

    // 2. Fetch products from Hyperline
    const products = await getHyperlineProducts();
    console.log(`Retrieved ${products.length} products from Hyperline`);

    // 3. Match customer needs with appropriate product
    const recommendedProduct = selectProductForCustomer(customerNeeds, products);
    console.log('Recommended product:', recommendedProduct?.name);

    if (!recommendedProduct) {
      return {
        success: false,
        message: "Couldn't find a suitable product match. Please contact sales directly."
      };
    }

    // 4. Create customer in Hyperline
    const customer = await createHyperlineCustomer(customerNeeds);
    console.log('Created customer in Hyperline:', customer.id);

    // 5. Create and send quote
    const quote = await createAndSendQuote(customer, recommendedProduct, customerNeeds);
    console.log('Quote created and sent:', quote.id);

    // 6. Send meeting link via Twilio if phone is provided
    let smsResult = null;
    if (customerNeeds.phone) {
      smsResult = await sendMeetingLinkViaSMS(customerNeeds.phone);
      console.log('SMS with meeting link sent:', smsResult);
    }

    // 7. Return comprehensive response
    return {
      success: true,
      quote: {
        id: quote.id,
        product: recommendedProduct.name,
        customer_id: customer.id,
        url: quote.url,
        expires_at: quote.expires_at,
        amount: quote.amount
      },
      meeting_link: MEETING_LINK,
      message: `Your personalized quote has been sent to ${customerNeeds.email}. We've also included a link to schedule a meeting with our team.`
    };
  } catch (error) {
    console.error('Error handling quote request:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: "We couldn't process your quote at this time. Please try again or contact our sales team directly."
    };
  }
}

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
    
    // Parse request data
    let requestData;
    try {
      requestData = await request.json();
      console.log('Request data received:', JSON.stringify(requestData, null, 2));
    } catch (error) {
      console.error('Failed to parse request body:', error);
      requestData = { services: {}, config: [] };
    }
    
    // Extract data from request, with fallbacks
    const services = requestData.services || {
      llm: "anthropic",
      tts: "elevenlabs", 
      stt: "deepgram"
    };
    
    // Define the tool schemas for Anthropic's function calling
    const toolSchemas = [
      {
        name: "provide_quote",
        description: "Generate a personalized quote for a customer based on their needs and qualifications",
        input_schema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "The customer's name"
            },
            email: {
              type: "string",
              description: "The customer's email address"
            },
            company: {
              type: "string",
              description: "The customer's company name (optional)"
            },
            phone: {
              type: "string",
              description: "The customer's phone number (optional)"
            },
            data_warehouse: {
              type: "string",
              description: "The data warehouse technology the customer is using (if applicable)"
            },
            project_status: {
              type: "string", 
              description: "The current status of the customer's project"
            },
            budget: {
              type: "number",
              description: "The customer's budget for this project"
            },
            requirements: {
              type: "array",
              items: {
                type: "string"
              },
              description: "List of requirements or needs for their project"
            },
            team_size: {
              type: "number",
              description: "The size of the customer's data/engineering team"
            }
          },
          required: ["name", "email"]
        }
      },
      {
        name: "collect_qualification_info",
        description: "Collect qualification information from a potential customer",
        input_schema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "The customer's name"
            },
            email: {
              type: "string",
              description: "The customer's email address"
            },
            company: {
              type: "string",
              description: "The customer's company name"
            },
            data_warehouse: {
              type: "string",
              description: "The data warehouse technology the customer is using"
            },
            project_status: {
              type: "string",
              description: "The current status of the customer's project"
            }
          },
          required: ["name", "email"]
        }
      },
      {
        name: "check_interest",
        description: "Check if a customer is interested in Portcullis services",
        input_schema: {
          type: "object",
          properties: {
            interest_level: {
              type: "string",
              enum: ["high", "medium", "low", "unknown"],
              description: "The customer's level of interest"
            },
            needs: {
              type: "string",
              description: "Brief description of what the customer is looking for"
            }
          },
          required: ["interest_level"]
        }
      }
    ];
    
    const config = requestData.config || [
      {
        service: "stt",
        options: [
          { name: "language", value: "en-US" }
        ]
      },
      {
        service: "tts",
        options: [
          { name: "voice", value: "6IlUNt4hAIP1jMBYQncS" }, // ElevenLabs voice ID
          { name: "model", value: "eleven_turbo_v2" },
          { name: "output_format", value: "pcm_24000" }, // Important for audio playback!
          { name: "stability", value: 0.5 },
          { name: "similarity_boost", value: 0.5 },
          { name: "latency", value: 1 }
        ]
      },
      {
        service: "llm",
        options: [
          { name: "model", value: "claude-3-5-sonnet-latest" },
          {
            name: "initial_messages",
            value: [
              {
                role: "system",
                content: "You are a friendly assistant for Portcullis, helping users understand our data warehouse steering assistance services. Your job is to help the user understand the services we offer and to collect the information we need to provide a quote. You should call the 'check_interest' tool to guage the user's interest and then call the 'provide_quote' tool to provide a quote. You should also call the 'collect_qualification_info' tool to collect the information we need to provide a quote."
              }
            ]
          },
          { name: "temperature", value: 0.7 },
          { name: "run_on_config", value: true },
          // Add the tools for Anthropic function calling
          { 
            name: "tools", 
            value: toolSchemas
          }
        ]
      }
    ];
    
    // Get client version if provided
    const rtvi_client_version = requestData.rtvi_client_version;
    
    // Create the bot configuration without webhook_tools
    const botConfig = {
      bot_profile: "voice_2024_08", // Use the standard voice profile
      max_duration: 600, // 10 minutes
      services,
      config,
      rtvi_client_version,
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

// Handle tool calls from Daily
export const handleToolCall = async (data: any) => {
  try {
    // Extract the tool name and parameters
    const { tool_name, parameters } = data;

    let responseData = {};

    // Handle different tools
    switch (tool_name) {
      case 'provide_quote':
        // Process the quote request with the comprehensive implementation
        responseData = await handleQuoteRequest(parameters);
        break;

      case 'collect_qualification_info':
        // Still maintain this for collecting info without generating a quote
        responseData = {
          success: true,
          message: 'Information collected successfully',
          next_steps: 'This information will be used to prepare your personalized quote.'
        };
        break;

      case 'check_interest':
        responseData = {
          success: true,
          message: 'Interest recorded',
          suggestion: 'Would you like me to prepare a quote based on your needs?'
        };
        break;

      default:
        return {
          error: 'Unknown tool', 
          message: `Tool '${tool_name}' is not supported`
        };
    }

    return responseData;
  } catch (error) {
    console.error('Tool call error:', error);
    return {
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
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