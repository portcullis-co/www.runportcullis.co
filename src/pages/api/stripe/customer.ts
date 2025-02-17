import type { APIRoute } from "astro";
import Stripe from "stripe";

export const post: APIRoute = async ({ request }) => {
    const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);
    const { customerId, teamId, channelId, messageTs } = await request.json();

    try {
        await stripe.customers.update(customerId, {
            metadata: {
                teamId,
                channelId,
                messageTs
            }
        });
        return new Response(JSON.stringify({ success: true }), {
            status: 200
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to update customer' }), {
            status: 500
        });
    }
}; 