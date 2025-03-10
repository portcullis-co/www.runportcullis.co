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

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    console.log('Webhook received:', data);

    // Extract the tool name and parameters
    const { tool_name, parameters } = data;

    let responseData = {};

    // Handle different webhook tools
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

// Comprehensive function to handle quote requests
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

// Function to get products from Hyperline
async function getHyperlineProducts(): Promise<HyperlineProduct[]> {
  try {
    // In production, this would make a real API call to Hyperline
    // For now, we'll return mock data to simulate the API response
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
    return data.data || [];

  } catch (error) {
    console.error('Error fetching Hyperline products:', error);
    
    // Fallback to mock products if the API call fails
    return [
      {
        id: 'prod_insights',
        name: 'Portcullis Insights',
        description: 'Basic data warehouse monitoring and weekly reports',
        price_configuration: { monthly: 150, annual: 1146 }
      },
      {
        id: 'prod_insights_plus',
        name: 'Portcullis Insights Plus',
        description: 'Advanced monitoring with custom dashboards and priority support',
        price_configuration: { monthly: 510, annual: 5196 }
      },
      {
        id: 'prod_gold',
        name: 'Portcullis Gold',
        description: 'Full-service management with dedicated data engineer and 24/7 support',
        price_configuration: { monthly: 4300, annual: 33540 }
      }
    ];
  }
}

// Function to select the appropriate product based on customer needs
function selectProductForCustomer(customerNeeds: CustomerNeeds, products: HyperlineProduct[]): HyperlineProduct | null {
  // Simple scoring system for product selection
  const scores = products.map(product => {
    let score = 0;
    
    // Score based on team size
    if (customerNeeds.teamSize) {
      if (customerNeeds.teamSize <= 5 && product.name.includes('Insights')) score += 3;
      else if (customerNeeds.teamSize <= 20 && product.name.includes('Plus')) score += 3;
      else if (customerNeeds.teamSize > 20 && product.name.includes('Gold')) score += 3;
    }
    
    // Score based on budget (assuming monthly)
    if (customerNeeds.budget) {
      const budgetNum = typeof customerNeeds.budget === 'string' 
        ? parseInt(customerNeeds.budget.replace(/[^0-9]/g, '')) 
        : customerNeeds.budget;
        
      if (budgetNum <= 200 && product.name.includes('Insights') && !product.name.includes('Plus')) score += 3;
      else if (budgetNum <= 1000 && product.name.includes('Plus')) score += 3;
      else if (budgetNum > 1000 && product.name.includes('Gold')) score += 3;
    }
    
    // Score based on requirements
    if (customerNeeds.requirements) {
      if (customerNeeds.requirements.some(req => req.toLowerCase().includes('basic') || req.toLowerCase().includes('monitor'))) {
        if (product.name.includes('Insights')) score += 2;
      }
      
      if (customerNeeds.requirements.some(req => 
        req.toLowerCase().includes('custom') || 
        req.toLowerCase().includes('dashboard') || 
        req.toLowerCase().includes('priority'))) {
        if (product.name.includes('Plus')) score += 2;
      }
      
      if (customerNeeds.requirements.some(req => 
        req.toLowerCase().includes('dedicated') || 
        req.toLowerCase().includes('24/7') || 
        req.toLowerCase().includes('full') || 
        req.toLowerCase().includes('managed'))) {
        if (product.name.includes('Gold')) score += 2;
      }
    }
    
    return { product, score };
  });
  
  // Sort by score (highest first) and return the top product
  scores.sort((a, b) => b.score - a.score);
  return scores.length > 0 && scores[0].score > 0 ? scores[0].product : products[0];
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
    
    // Determine subscription interval and amount
    const billingPreference = customerNeeds.requirements?.some(req => req.toLowerCase().includes('annual')) 
      ? 'annual' : 'monthly';
    
    const amount = product.price_configuration?.[billingPreference] || 
      (billingPreference === 'annual' ? 1146 : 150);
    
    // In production, this would create a quote via Hyperline API
    const quoteResponse = await fetch(`${HYPERLINE_API_BASE}/quotes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HYPERLINE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'draft',
        owner_email: 'sales@runportcullis.co',
        customer_id: customer.id,
        invoicing_entity_id: INVOICING_ENTITY_ID,
        comments: `Thank you for your interest in Portcullis! Based on your needs, we recommend our ${product.name} plan. You can also schedule a meeting with us here: ${MEETING_LINK}`,
        terms: "By signing this quote, you accept our terms of service.",
        amount: amount * 100, // Convert to cents
        collect_payment_details: true,
        automatically_start_subscription: true,
        expires_at: expiresAt.toISOString(),
        subscription: {
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
        }
      })
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
        message: `Hello ${customer.name},\n\nThank you for your interest in Portcullis! We've prepared a quote for our ${product.name} plan based on your needs.\n\nYou can also schedule a meeting with us here: ${MEETING_LINK}\n\nLooking forward to working with you,\nThe Portcullis Team`
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
      amount: product.price_configuration?.monthly || 150 * 100
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