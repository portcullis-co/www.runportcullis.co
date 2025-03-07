// src/pages/api/clerk-webhook.ts
import type { APIRoute } from 'astro';
import { Webhook } from 'svix';

// Define the webhook event types we want to handle
type WebhookEvent = {
  data: {
    id: string;
    email_addresses: Array<{
      email_address: string;
      id: string;
      verification: {
        status: string;
      };
    }>;
    first_name: string;
    last_name: string;
    created_at: number;
    updated_at: number;
  };
  object: string;
  type: string;
};

export const POST: APIRoute = async ({ request }) => {
  // Get the webhook signature from the request headers
  const svix_id = request.headers.get('svix-id');
  const svix_timestamp = request.headers.get('svix-timestamp');
  const svix_signature = request.headers.get('svix-signature');

  // If any of the required headers are missing, return an error
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response(JSON.stringify({ error: 'Missing svix headers' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Get the webhook secret from environment variables
  const webhookSecret = import.meta.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('Missing CLERK_WEBHOOK_SECRET environment variable');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Get the raw body from the request
  const body = await request.text();
  
  // Verify the webhook signature
  let event: WebhookEvent;
  try {
    const wh = new Webhook(webhookSecret);
    event = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response(JSON.stringify({ error: 'Invalid signature' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Handle different event types
  const eventType = event.type;
  
  // Process the event based on its type
  try {
    switch (eventType) {
      case 'user.created':
        // Handle user creation
        await handleUserCreated(event.data);
        break;
        
      case 'user.updated':
        // Handle user updates
        await handleUserUpdated(event.data);
        break;
        
      case 'user.deleted':
        // Handle user deletion
        await handleUserDeleted(event.data);
        break;
        
      default:
        // Log unhandled event types
        console.log(`Unhandled webhook event: ${eventType}`);
    }
    
    // Return a success response
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error(`Error handling webhook ${eventType}:`, error);
    return new Response(JSON.stringify({ error: 'Error processing webhook' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// Handler functions for different event types
async function handleUserCreated(userData: WebhookEvent['data']) {
  console.log('User created:', userData.id);
  // Implement your user creation logic here
  // For example, store the user in your database
}

async function handleUserUpdated(userData: WebhookEvent['data']) {
  console.log('User updated:', userData.id);
  // Implement your user update logic here
  // For example, update the user in your database
}

async function handleUserDeleted(userData: WebhookEvent['data']) {
  console.log('User deleted:', userData.id);
  // Implement your user deletion logic here
  // For example, remove the user from your database
}