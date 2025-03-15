import type { APIRoute } from 'astro';
import { broadcast } from './sse';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    console.log("📞 Received function call:", JSON.stringify(data));

    // Extract function name and arguments
    const { function_name, arguments: args } = data;

    if (!function_name) {
      return new Response(JSON.stringify({ 
        error: "Missing function_name parameter" 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle different function calls
    switch (function_name) {
      case 'show_calendar':
        // Broadcast the show_calendar event with a fixed value
        broadcast('show_calendar', {});
        
        return new Response(JSON.stringify({
          success: true,
          message: "Calendar dialog displayed successfully"
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      case 'create_call':
        // Broadcast the create_call event
        broadcast('create_call', {
          message: args?.message || "Enter your phone number to receive a call from our AI assistant."
        });
        
        return new Response(JSON.stringify({
          success: true,
          message: "Call request dialog displayed successfully"
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({ 
          error: `Unknown function: ${function_name}` 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error("Error processing function call:", error);
    return new Response(JSON.stringify({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Add OPTIONS handler for CORS
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