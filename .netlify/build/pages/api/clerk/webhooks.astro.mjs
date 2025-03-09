import { Webhook } from "svix";
import { renderers } from "../../../renderers.mjs";
const POST = async ({ request }) => {
  const svix_id = request.headers.get("svix-id");
  const svix_timestamp = request.headers.get("svix-timestamp");
  const svix_signature = request.headers.get("svix-signature");
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response(JSON.stringify({ error: "Missing svix headers" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  const webhookSecret = "whsec_dyHMdjz1jvXhf5cR6g5yrJRmwj8mtAHg";
  const body = await request.text();
  let event;
  try {
    const wh = new Webhook(webhookSecret);
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  const eventType = event.type;
  try {
    switch (eventType) {
      case "user.created":
        await handleUserCreated(event.data);
        break;
      case "user.updated":
        await handleUserUpdated(event.data);
        break;
      case "user.deleted":
        await handleUserDeleted(event.data);
        break;
      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error(`Error handling webhook ${eventType}:`, error);
    return new Response(JSON.stringify({ error: "Error processing webhook" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
async function handleUserCreated(userData) {
  console.log("User created:", userData.id);
}
async function handleUserUpdated(userData) {
  console.log("User updated:", userData.id);
}
async function handleUserDeleted(userData) {
  console.log("User deleted:", userData.id);
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
