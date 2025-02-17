import Stripe from "stripe";

export async function updateCustomer(params: {
    customerId: string,
    teamId: string,
    channelId: string,
    messageTs: string
  }): Promise<void> {
    const { customerId, teamId, channelId, messageTs } = params;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    await stripe.customers.update(customerId, {
        metadata: {
            teamId: teamId,
            channelId: channelId,
            messageTs: messageTs
        }
    });
  }