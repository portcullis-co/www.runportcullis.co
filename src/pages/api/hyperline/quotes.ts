import type { APIRoute } from 'astro';
import { broadcast } from '../assistant/events';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Validate environment variables
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
    const requestData = await request.json();
    console.log('Create quote request:', JSON.stringify(requestData, null, 2));
    
    // Validate required fields
    if (!requestData.customerId) {
      return new Response(JSON.stringify({
        error: 'Missing required field: customerId'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Determine if we're in test mode (sandbox)
    const IS_SANDBOX = import.meta.env.HYPERLINE_ENV === 'sandbox';
    const HYPERLINE_API_BASE = IS_SANDBOX 
      ? 'https://sandbox.api.hyperline.co/v1'
      : 'https://api.hyperline.co/v1';
    
    // Get customer details first
    const customerResponse = await fetch(`${HYPERLINE_API_BASE}/customers/${requestData.customerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.HYPERLINE_API_KEY}`
      }
    });
    
    if (!customerResponse.ok) {
      console.error('Error retrieving customer from Hyperline');
      return new Response(JSON.stringify({
        error: 'Failed to retrieve customer information'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    const customerData = await customerResponse.json();
    
    // Prepare quote data
    const quoteData = {
      // Required fields
      customer_id: requestData.customerId,
      title: 'Portcullis Data Warehouse Services Quote',
      // Optional fields
      description: requestData.description || 'Generated quote for Portcullis services based on customer needs',
      expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      // Add line items if products are provided
      line_items: requestData.products 
        ? requestData.products.map((productId: string) => ({
            product_id: productId,
            quantity: 1
          }))
        : [],
      // Add metadata if needed
      metadata: {
        source: 'portcullis_voice_assistant',
        ...(requestData.budget && { budget: requestData.budget })
      }
    };
    
    // Create quote in Hyperline
    const response = await fetch(`${HYPERLINE_API_BASE}/quotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.HYPERLINE_API_KEY}`
      },
      body: JSON.stringify(quoteData)
    });
    
    // Parse response
    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (error) {
      console.error('Invalid response from Hyperline API:', responseText);
      return new Response(JSON.stringify({
        error: 'Invalid response from Hyperline API'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    if (!response.ok) {
      console.error('Error creating quote in Hyperline:', responseData);
      return new Response(JSON.stringify({
        error: 'Failed to create quote',
        details: responseData
      }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Broadcast a quote_created event via SSE
    broadcast('quote_created', {
      quote_id: responseData.id,
      customer_id: requestData.customerId,
      customer_name: customerData.name,
      customer_email: customerData.email
    });
    
    // Return success response
    return new Response(JSON.stringify({
      success: true,
      quote: responseData
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Unhandled error in quotes endpoint:', error);
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