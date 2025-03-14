import type { APIRoute } from 'astro';
import { broadcast } from '../sse';

// Handle broadcasting the show_calendar event via SSE
export const POST: APIRoute = async ({ request }) => {
  try {
    // Default URL if none is provided
    let url = 'https://cal.com/team/portcullis/portcullis-intro';
    
    // Parse the request body if it exists
    if (request.headers.get('content-type')?.includes('application/json')) {
      const body = await request.json();
      if (body.url) {
        url = body.url;
      }
    }

    // Broadcast the show_calendar event with the URL
    broadcast('show_calendar', { url });

    return new Response(JSON.stringify({
      success: true,
      message: 'Calendar event broadcasted successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error broadcasting calendar event:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to broadcast calendar event'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// Handle CORS preflight requests
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}; 