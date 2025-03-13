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
    console.log('Create customer request:', JSON.stringify(requestData, null, 2));
    
    // Validate required fields
    if (!requestData.firstName || !requestData.lastName || !requestData.email) {
      return new Response(JSON.stringify({
        error: 'Missing required fields: firstName, lastName, and email are required'
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
    
    // Prepare customer data for Hyperline API
    const customerData = {
      name: `${requestData.firstName} ${requestData.lastName}`,
      email: requestData.email,
      email_confirmed: true,
      // Add optional fields if provided
      ...(requestData.company && { company_name: requestData.company }),
      ...(requestData.domain && { domain: requestData.domain }),
      // Add custom attributes if needed
      metadata: {
        source: 'portcullis_voice_assistant',
        ...(requestData.budget && { budget: requestData.budget })
      }
    };
    
    // Create customer in Hyperline
    const response = await fetch(`${HYPERLINE_API_BASE}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.HYPERLINE_API_KEY}`
      },
      body: JSON.stringify(customerData)
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
      console.error('Error creating customer in Hyperline:', responseData);
      return new Response(JSON.stringify({
        error: 'Failed to create customer',
        details: responseData
      }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Broadcast a customer_created event via SSE
    broadcast('customer_created', {
      customer_id: responseData.id,
      customer_name: `${requestData.firstName} ${requestData.lastName}`,
      customer_email: requestData.email
    });
    
    // Return success response
    return new Response(JSON.stringify({
      success: true,
      customer: responseData
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Unhandled error in customers endpoint:', error);
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