// Twilio TwiML Endpoint
// Provides instructions to Twilio on how to handle the call

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    console.log("☎️ TwiML endpoint called");
    
    // Hardcode the phone numbers instead of relying on URL parameters
    const twilioNumber = import.meta.env.TWILIO_PHONE_NUMBER || '+18444354338';
    const personalNumber = import.meta.env.PERSONAL_PHONE_NUMBER || '+18657763192';
    
    // For logging purposes, mask most of the personal number
    const maskedPersonalNumber = personalNumber.substring(0, 4) + '******' + personalNumber.substring(personalNumber.length - 2);
    console.log(`☎️ Connecting call to: ${maskedPersonalNumber}`);
    
    // Create the TwiML document
    // This tells Twilio to connect the caller to your personal number
    // The callerId will be the Twilio number (or can be the personal number if preferred)
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Please wait while we connect you with a Portcullis representative.</Say>
  <Dial callerId="${twilioNumber}">
    ${personalNumber}
  </Dial>
  <Say>The call has ended. Thank you for contacting Portcullis.</Say>
</Response>`;
    
    console.log("☎️ Returning TwiML to connect call");
    
    // Return the TwiML as XML
    return new Response(twiml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml'
      }
    });
  } catch (error) {
    console.error("☎️ Error in Twilio TwiML endpoint:", error);
    
    // Even on error, we need to return valid TwiML, but we can include an error message
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>We're sorry, but there was an error connecting your call. Please try again later.</Say>
</Response>`;
    
    return new Response(errorTwiml, {
      status: 200, // Still return 200 as Twilio expects valid TwiML
      headers: {
        'Content-Type': 'text/xml'
      }
    });
  }
};

// Also handle POST requests as Twilio might use either method
export const POST: APIRoute = async (context) => {
  return GET(context);
}; 