// src/pages/api/webhook.ts

import { IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';

const SECRET_KEY = process.env.SECRET_KEY!;  // Replace with the actual secret key

export async function POST(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    // Read the raw request body
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', () => {
      try {
        // Get the signature from the request headers (depends on the service)
        const signature = req.headers['x-signature'] as string;

        // Generate the expected signature based on the request body and secret key
        const expectedSignature = crypto
          .createHmac('sha256', SECRET_KEY)
          .update(data)
          .digest('hex');

        // Compare the signatures
        if (signature !== expectedSignature) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Invalid signature' }));
          return;
        }

        // Parse the incoming JSON data
        const parsedData = JSON.parse(data);

        // Process the webhook data
        console.log('Received valid webhook data:', parsedData);

        // Respond with a success status
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Webhook received successfully' }));
      } catch (error) {
        // If there was an error processing the webhook data
        console.error('Error processing webhook:', error);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid webhook data' }));
      }
    });
  } catch (error) {
    // Handle any errors in the webhook request processing
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}
