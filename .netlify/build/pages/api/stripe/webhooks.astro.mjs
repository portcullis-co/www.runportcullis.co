import Stripe from "stripe";
import { jitsuAnalytics } from "@jitsu/js";
import { clerkClient } from "@clerk/express";
import { renderers } from "../../../renderers.mjs";
const POST = async ({ request }) => {
  const stripeSecretKey = "sk_test_51Qe50OGSPDCwljL72wasQrH6sZPGK7FCtMxw8pfViAGP7qEWyFhlsYM7THMrciW4AdLdkkJqL7ZVV8qkWkumqlCZ00M7JYms0u";
  const endpointSecret = "whsec_rnI8zmmDAz9d6hCZv6W84zuvzCQqgmJ0";
  const stripe = new Stripe(stripeSecretKey);
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response(JSON.stringify({ error: "Missing stripe-signature header" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  const body = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    const errorMessage = err.message;
    console.error("⚠️ Webhook signature verification failed:", errorMessage);
    return new Response(JSON.stringify({ error: `Webhook signature verification failed: ${errorMessage}` }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  try {
    switch (event.type) {
      case "checkout.session.completed":
        const checkoutSession = event.data.object;
        await handleCheckoutSessionCompleted(checkoutSession);
        break;
      case "invoice.paid":
        const invoice = event.data.object;
        await handleInvoicePaid(invoice);
        break;
      case "invoice.payment_failed":
        const failedInvoice = event.data.object;
        await handleInvoicePaymentFailed(failedInvoice);
        break;
      case "customer.subscription.created":
        const subscriptionCreated = event.data.object;
        await handleSubscriptionCreated(subscriptionCreated);
        break;
      case "customer.subscription.updated":
        const subscriptionUpdated = event.data.object;
        await handleSubscriptionUpdated(subscriptionUpdated);
        break;
      case "customer.subscription.deleted":
        const subscriptionDeleted = event.data.object;
        await handleSubscriptionDeleted(subscriptionDeleted);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error(`Error handling webhook ${event.type}:`, error);
    return new Response(JSON.stringify({ error: "Error processing webhook" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
async function createClerkUser(email, metadata = {}) {
  try {
    const user = await clerkClient.users.createUser({
      emailAddress: [email],
      firstName: metadata.firstName || "",
      lastName: metadata.lastName || "",
      publicMetadata: {
        stripeCustomerId: metadata.stripeCustomerId,
        subscriptionId: metadata.subscriptionId,
        subscriptionStatus: "active",
        ...metadata.customMetadata
      }
    });
    await clerkClient.emailAddresses.createEmailAddress({
      userId: user.id,
      emailAddress: email,
      verified: false
    });
    console.log(`Created and invited Clerk user with ID: ${user.id} and email: ${email}`);
    return user;
  } catch (error) {
    console.error("Error creating Clerk user:", error);
    throw error;
  }
}
async function handleCheckoutSessionCompleted(session) {
  console.log("Checkout session completed:", session.id);
  const customerId = session.customer;
  const subscriptionId = session.subscription;
  const customerEmail = session.customer_details?.email;
  if (!customerId) {
    console.error("No customer ID found in checkout session");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No customer ID found in checkout session" })
    };
  }
  try {
    const stripe = new Stripe("sk_test_51Qe50OGSPDCwljL72wasQrH6sZPGK7FCtMxw8pfViAGP7qEWyFhlsYM7THMrciW4AdLdkkJqL7ZVV8qkWkumqlCZ00M7JYms0u");
    const customer = await stripe.customers.retrieve(customerId);
    const analytics = jitsuAnalytics({
      host: "https://events.runportcullis.co",
      writeKey: "kCrDubahfVaEe72PBhwgJpBQMFKdvdHT:FurmPhiiJxeY7BZlZ9xEV72RltcNHKxN"
    });
    const amountTotal = session.amount_total ? (session.amount_total / 100).toFixed(2) : "N/A";
    const currency = session.currency ? session.currency.toUpperCase() : "USD";
    let lineItems = [];
    if (session.line_items && session.line_items.data && session.line_items.data.length > 0) {
      lineItems = session.line_items.data;
    } else if (session.id) {
      const lineItemsResponse = await stripe.checkout.sessions.listLineItems(session.id);
      lineItems = lineItemsResponse.data;
    }
    const productNames = lineItems.length > 0 ? lineItems.map((item) => item.description || "Unnamed product").join(", ") : "Products not available";
    let clerkUser = null;
    if (customerEmail) {
      const customerName = typeof customer === "object" && "name" in customer && customer.name ? customer.name.split(" ") : [];
      const firstName = customerName.length > 0 ? customerName[0] : "";
      const lastName = customerName.length > 1 ? customerName.slice(1).join(" ") : "";
      clerkUser = await createClerkUser(customerEmail, {
        firstName,
        lastName,
        stripeCustomerId: customerId,
        subscriptionId,
        customMetadata: {
          checkoutSessionId: session.id,
          purchasedProducts: productNames
        }
      });
      console.log("Clerk user created:", clerkUser);
      await analytics.track({
        event: "Checkout Completed",
        userId: clerkUser.id,
        properties: {
          email: customerEmail,
          firstName,
          lastName,
          stripeCustomerId: customerId,
          subscriptionId,
          purchasedProducts: productNames
        }
      });
      console.log(`Created Clerk user with ID: ${clerkUser.id} for customer email: ${customerEmail}`);
    } else {
      console.warn("No customer email found in checkout session, Clerk user not created");
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Checkout session processed successfully", clerkUser })
    };
  } catch (error) {
    console.error("Error processing checkout session:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error processing checkout session", error })
    };
  }
}
async function handleInvoicePaid(invoice) {
  console.log("Invoice paid:", invoice.id);
}
async function handleInvoicePaymentFailed(invoice) {
  console.log("Invoice payment failed:", invoice.id);
}
async function handleSubscriptionCreated(subscription) {
  console.log("Subscription created:", subscription.id);
}
async function handleSubscriptionUpdated(subscription) {
  console.log("Subscription updated:", subscription.id);
}
async function handleSubscriptionDeleted(subscription) {
  console.log("Subscription deleted:", subscription.id);
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
