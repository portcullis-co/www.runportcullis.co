import type { APIRoute } from "astro";
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY, { apiVersion: '2025-01-27.acacia' });

export const POST: APIRoute = async ({ request }) => {
  try {
    // You can optionally pass customer information if you have it
    const setupIntent = await stripe.setupIntents.create({
      payment_method_types: ['card'],
    });

    return new Response(JSON.stringify({ 
      clientSecret: setupIntent.client_secret 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};