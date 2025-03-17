import type { APIRoute } from 'astro';
import twilio from 'twilio';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const POST: APIRoute = async ({ request }) => {
  console.log('Received Twilio dialout request');

  try {
    const requestData = await request.json();
    const { phoneNumber } = requestData;

    // Validate input
    if (!phoneNumber) {
      console.error('Missing phone number in request');
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing call request to: ${phoneNumber.substring(0, 3)}*****`);

    // Check for required environment variables
    const accountSid = import.meta.env.TWILIO_ACCOUNT_SID;
    const authToken = import.meta.env.TWILIO_AUTH_TOKEN;
    const twilioNumber = import.meta.env.TWILIO_PHONE_NUMBER || '+18444354338';
    const personalNumber = import.meta.env.PERSONAL_PHONE_NUMBER || '+18657763192';

    if (!accountSid || !authToken) {
      console.error('Missing Twilio credentials');
      return new Response(
        JSON.stringify({ error: 'Twilio credentials not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate the phone number
    let formattedPhoneNumber;
    try {
      const parsedNumber = parsePhoneNumberFromString(phoneNumber);
      if (!parsedNumber) {
        throw new Error('Failed to parse phone number');
      }
      
      formattedPhoneNumber = parsedNumber.format('E.164');
      
      if (!parsedNumber.isValid()) {
        throw new Error('Invalid phone number format');
      }
    } catch (err) {
      console.error('Phone number validation failed:', err);
      return new Response(
        JSON.stringify({ error: 'Invalid phone number format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the domain for the TwiML URL
    const host = request.headers.get('host') || 'localhost:4321';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const twimlUrl = `${protocol}://${host}/api/assistant/twilio`;

    console.log(`Using TwiML URL: ${twimlUrl}`);

    // Initialize Twilio client
    const client = twilio(accountSid, authToken);

    // Make the call
    const call = await client.calls.create({
      to: formattedPhoneNumber,
      from: twilioNumber,
      url: twimlUrl,
    });

    console.log(`Call initiated with SID: ${call.sid}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Call initiated successfully',
        callSid: call.sid 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error initiating Twilio call:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 