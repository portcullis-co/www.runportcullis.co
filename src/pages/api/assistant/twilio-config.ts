// Twilio Configuration endpoint for Daily Bots
// Documentation: https://docs.dailybots.ai/api-reference/endpoint/createTwilioConfig

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    console.log("📱 Received Twilio configuration request:", JSON.stringify(data));

    // Validate required fields
    if (!data.twilioNumber || !data.accountSid || !data.authToken) {
      console.error("❌ Missing required Twilio configuration parameters");
      return new Response(JSON.stringify({ 
        error: "Missing required parameters", 
        message: "Must include twilioNumber, accountSid, and authToken"
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check for Daily API key
    if (!import.meta.env.DAILY_API_KEY) {
      console.error("❌ Missing DAILY_API_KEY environment variable");
      return new Response(JSON.stringify({ 
        error: "Server configuration error: Missing DAILY_API_KEY" 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create the webhook URL for incoming calls
    const webhookUrl = new URL("/api/assistant/dialin", request.url).toString();
    console.log(`📱 Using webhook URL: ${webhookUrl}`);

    // Create payload for Daily API to configure Twilio
    const configPayload = {
      properties: {
        twilio: {
          phone_number: data.twilioNumber,
          account_sid: data.accountSid,
          auth_token: data.authToken,
          webhook_url: webhookUrl,
          name_prefix: data.namePrefix || "portcullis-call"
        }
      }
    };

    // Call Daily API to configure Twilio
    console.log("📱 Sending Twilio configuration to Daily API");
    const configResponse = await fetch("https://api.daily.co/v1/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.DAILY_API_KEY}`,
      },
      body: JSON.stringify(configPayload),
    });

    if (!configResponse.ok) {
      const errorData = await configResponse.json();
      console.error(`❌ Failed to configure Twilio: ${configResponse.status}`, errorData);
      return new Response(JSON.stringify({
        error: "Failed to configure Twilio with Daily",
        details: errorData
      }), {
        status: configResponse.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const configResult = await configResponse.json();
    console.log(`✅ Successfully configured Twilio for number: ${data.twilioNumber}`);
    
    // Now register the number with our dialin endpoint
    const dialinResponse = await fetch(new URL("/api/assistant/dialin", request.url).toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        configure: true,
        phoneNumber: data.twilioNumber,
        namePrefix: data.namePrefix || "portcullis-call"
      })
    });

    if (!dialinResponse.ok) {
      console.warn("⚠️ Twilio configuration successful but dialin registration failed.");
      const dialinError = await dialinResponse.json();
      
      return new Response(JSON.stringify({ 
        success: true,
        message: "Twilio configuration successful but dialin registration failed",
        dailyConfig: configResult,
        dialinError
      }), {
        status: 207, // Partial success
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const dialinResult = await dialinResponse.json();
    console.log("✅ Successfully registered phone number with dialin endpoint");

    return new Response(JSON.stringify({
      success: true,
      message: "Twilio configuration successfully created and registered",
      dailyConfig: configResult,
      dialinConfig: dialinResult
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("❌ Error in Twilio configuration API route:", error);
    return new Response(JSON.stringify({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 