import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { jitsuAnalytics } from '@jitsu/js';
// Add Clerk SDK
import { clerkClient } from '@clerk/express';

export const POST: APIRoute = async ({ request }) => {
  // Get the Stripe secret key from environment variables
  const stripeSecretKey = import.meta.env.STRIPE_SECRET_KEY;
  const endpointSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;
  const clerkSecretKey = import.meta.env.CLERK_SECRET_KEY;

  if (!stripeSecretKey || !endpointSecret || !clerkSecretKey) {
    console.error('Missing required environment variables for webhook');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Initialize Stripe with your secret key
  const stripe = new Stripe(stripeSecretKey);
  
  // Get the signature from the headers
  const signature = request.headers.get('stripe-signature');
  
  if (!signature) {
    return new Response(JSON.stringify({ error: 'Missing stripe-signature header' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Get the raw body from the request
  const body = await request.text();
  
  // Verify the webhook signature
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    const errorMessage = (err as Error).message;
    console.error('⚠️ Webhook signature verification failed:', errorMessage);
    return new Response(JSON.stringify({ error: `Webhook signature verification failed: ${errorMessage}` }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Handle the event based on its type
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        // Payment is successful and the subscription is created
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(checkoutSession);
        break;
        
      case 'invoice.paid':
        // Continue to provision the subscription as payments succeed
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
        
      case 'invoice.payment_failed':
        // The payment failed or the customer does not have a valid payment method
        const failedInvoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(failedInvoice);
        break;
        
      case 'customer.subscription.created':
        const subscriptionCreated = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscriptionCreated);
        break;
        
      case 'customer.subscription.updated':
        const subscriptionUpdated = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscriptionUpdated);
        break;
        
      case 'customer.subscription.deleted':
        const subscriptionDeleted = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscriptionDeleted);
        break;
        
      default:
        // Unexpected event type
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a success response
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error(`Error handling webhook ${event.type}:`, error);
    return new Response(JSON.stringify({ error: 'Error processing webhook' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// Function to create and invite a Clerk user
async function createClerkUser(email: string, metadata: any = {}) {
  try {
    // Create a new user in Clerk
    const user = await clerkClient.users.createUser({
      emailAddress: [email],
      firstName: metadata.firstName || '',
      lastName: metadata.lastName || '',
      publicMetadata: {
        stripeCustomerId: metadata.stripeCustomerId,
        subscriptionId: metadata.subscriptionId,
        subscriptionStatus: 'active',
        ...metadata.customMetadata
      }
    });
    
    // Send an email invitation
    await clerkClient.emailAddresses.createEmailAddress({
      userId: user.id,
      emailAddress: email,
      verified: false
    });
    
    console.log(`Created and invited Clerk user with ID: ${user.id} and email: ${email}`);
    return user;
  } catch (error) {
    console.error('Error creating Clerk user:', error);
    throw error;
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    console.log('Checkout session completed:', session.id);
  
    // Get customer details
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;
    const customerEmail = session.customer_details?.email;
  
    if (!customerId) {
      console.error('No customer ID found in checkout session');
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'No customer ID found in checkout session' })
      };
    }
  
    try {
      // Fetch additional customer information if needed
      const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);
      const customer = await stripe.customers.retrieve(customerId);
      const analytics = jitsuAnalytics({
        host: "https://events.runportcullis.co",
        writeKey: import.meta.env.JITSU_HOMEPAGE_BROWSER_WRITE_KEY,
      });
  
      // Calculate amount in dollars (Stripe amounts are in cents)
      const amountTotal = session.amount_total ? (session.amount_total / 100).toFixed(2) : "N/A";
      const currency = session.currency ? session.currency.toUpperCase() : "USD";
  
      // Get line items if available
      let lineItems: Stripe.LineItem[] = [];
      if (session.line_items && session.line_items.data && session.line_items.data.length > 0) {
        lineItems = session.line_items.data;
      } else if (session.id) {
        // If line items aren't included in the webhook, fetch them
        const lineItemsResponse = await stripe.checkout.sessions.listLineItems(session.id);
        lineItems = lineItemsResponse.data;
      }
  
      // Get product names
      const productNames = lineItems.length > 0
        ? lineItems.map(item => item.description || 'Unnamed product').join(', ')
        : 'Products not available';
  
      // Create Clerk user if customer email is available
      let clerkUser = null;
      if (customerEmail) {
        // Extract possible name from customer object
        const customerName = typeof customer === 'object' && 'name' in customer && customer.name
          ? customer.name.split(' ')
          : [];
  
        const firstName = customerName.length > 0 ? customerName[0] : '';
        const lastName = customerName.length > 1 ? customerName.slice(1).join(' ') : '';
  
        // Create the user in Clerk
        clerkUser = await createClerkUser(customerEmail, {
          firstName,
          lastName,
          stripeCustomerId: customerId,
          subscriptionId: subscriptionId,
          customMetadata: {
            checkoutSessionId: session.id,
            purchasedProducts: productNames
          }
        });
        console.log('Clerk user created:', clerkUser);
        await analytics.track({
          event: 'Checkout Completed',
          userId: clerkUser.id,
          properties: {
            email: customerEmail,
            firstName,
            lastName,
            stripeCustomerId: customerId,
            subscriptionId: subscriptionId,
            purchasedProducts: productNames
          }
        });
        console.log(`Created Clerk user with ID: ${clerkUser.id} for customer email: ${customerEmail}`);
      } else {
        console.warn('No customer email found in checkout session, Clerk user not created');
      }
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Checkout session processed successfully', clerkUser })
      };
    } catch (error) {
      console.error('Error processing checkout session:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error processing checkout session', error })
      };
    }
  }

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log('Invoice paid:', invoice.id);
  
  // You might want to:
  // 1. Update subscription status in your database
  // 2. Send receipt to the customer
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id);
  
  // You might want to:
  // 1. Notify the customer about the failed payment
  // 2. Attempt to recover the payment or provide instructions
  // 3. Update subscription status in your database
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);
  
  // You might want to:
  // 1. Store subscription details in your database
  // 2. Provision access to your product features based on the plan
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);
  
  // You might want to:
  // 1. Update subscription details in your database
  // 2. Adjust user access based on new subscription status or plan
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  // You might want to:
  // 1. Update subscription status in your database
  // 2. Revoke access to premium features
  // 3. Send cancellation confirmation
}