import type { APIRoute } from 'astro';
import { broadcast } from '../sse';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    console.log("📅 Received Cal.com webhook:", JSON.stringify(data));

    // Verify the webhook is from Cal.com (add your own verification logic)
    // Cal.com sends a signature in headers that you can verify

    // Check if this is a booking created/confirmed event
    if (data.triggerEvent === 'BOOKING_CREATED' || data.triggerEvent === 'BOOKING_CONFIRMED') {
      const eventData = {
        eventType: data.payload.eventType?.title || 'Meeting',
        startTime: data.payload.startTime,
        endTime: data.payload.endTime,
        attendeeName: data.payload.attendees[0]?.name || 'Guest',
        attendeeEmail: data.payload.attendees[0]?.email
      };

      console.log("📅 Broadcasting calendar_event_scheduled with data:", eventData);
      
      // Broadcast the event to connected clients
      broadcast('calendar_event_scheduled', eventData);
      
      return new Response(JSON.stringify({
        success: true,
        message: "Event scheduled notification sent to assistant"
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // For other webhook events, just acknowledge receipt
    return new Response(JSON.stringify({
      success: true,
      message: "Webhook received but no action taken"
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error processing Cal.com webhook:", error);
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