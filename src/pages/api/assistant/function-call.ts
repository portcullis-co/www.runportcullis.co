import type { APIRoute } from 'astro';
import { broadcast } from './sse';
import { Analytics } from '@segment/analytics-node'


const anonymousId = crypto.randomUUID();
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
        // Broadcast the show_calendar event
        try {
          broadcast('show_calendar', {});
          console.log("📆 Successfully broadcast show_calendar event");
        } catch (broadcastError) {
          console.error("📆 Error broadcasting show_calendar event:", broadcastError);
          // Continue and return success anyway since we'll handle it directly in the component
        }
        
        return new Response(JSON.stringify({
          success: true,
          message: "Calendar dialog displayed successfully"
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      case 'create_call':
        // Broadcast the create_call event
        try {
          broadcast('create_call', {
            message: args?.message || "Enter your phone number to receive a call from our AI assistant."
          });
          console.log("📞 Successfully broadcast create_call event");
        } catch (broadcastError) {
          console.error("📞 Error broadcasting create_call event:", broadcastError);
          // Continue and return success anyway since we'll handle it directly in the component
        }
        
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