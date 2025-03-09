import twilio from "twilio";
import { renderers } from "../../../renderers.mjs";
const twilioClient = twilio(
  "ACb9b8bf0e399826b38b326efd34765d1c",
  "41c4e9bb1c2ee42d37a93b8c39cd8a67"
);
const PRICING_INFO = {
  insights: {
    monthly: "$150/month",
    annual: "$95.50/month",
    features: [
      "Basic steering assistance",
      "Data warehouse health monitoring",
      "Weekly insights reports",
      "Slack support"
    ]
  },
  insights_plus: {
    monthly: "$510/month",
    annual: "$433/month",
    features: [
      "Everything in Insights, plus:",
      "Custom dashboard creation",
      "Automated reporting",
      "Priority support",
      "Monthly strategy sessions"
    ]
  },
  gold: {
    monthly: "$4,300/month",
    annual: "$2,795/month",
    features: [
      "Everything in Insights Plus, plus:",
      "Dedicated data engineer",
      "24/7 support",
      "Custom development",
      "Weekly strategy sessions",
      "Implementation assistance"
    ]
  }
};
const POST = async ({ request }) => {
  try {
    const data = await request.json();
    return handleFunctionCall(data);
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
};
async function handleFunctionCall(data) {
  switch (data.function_name) {
    case "get_pricing_info":
      return handlePricingInfo(data.arguments);
    case "collect_qualification_info":
      return handleQualificationInfo(data.arguments);
    case "send_meeting_link":
      return handleSendMeetingLink(data.arguments);
    case "check_interest":
      return handleInterestCheck(data.arguments);
    default:
      return new Response(
        JSON.stringify({ error: `Unknown function: ${data.function_name}` }),
        { status: 400 }
      );
  }
}
function handlePricingInfo(args) {
  const tier = args.tier?.toLowerCase() || "insights";
  const billing = args.billing_preference || "monthly";
  if (tier in PRICING_INFO) {
    return new Response(JSON.stringify({
      status: "success",
      pricing: {
        tier,
        price: PRICING_INFO[tier][billing],
        features: PRICING_INFO[tier].features,
        billing
      }
    }));
  }
  return new Response(
    JSON.stringify({ error: "Invalid pricing tier" }),
    { status: 400 }
  );
}
async function handleSendMeetingLink(args) {
  const { callerPhone } = args;
  try {
    const message = await twilioClient.messages.create({
      from: "+18444354338",
      to: callerPhone,
      body: `Here is a link to schedule some time with Portcullis: https://cal.com/team/portcullis/portcullis-intro`
    });
    return new Response(JSON.stringify({
      status: "success",
      messageSid: message.sid
    }));
  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500 }
    );
  }
}
function handleQualificationInfo(args) {
  try {
    const info = {
      data_warehouse: args.data_warehouse || "",
      team_size: parseInt(args.team_size) || 0,
      project_status: args.project_status || "",
      support_needs: args.support_needs || "",
      billing_preference: args.billing_preference || "monthly"
    };
    return new Response(JSON.stringify({
      status: "success",
      qualification_info: info
    }));
  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500 }
    );
  }
}
function handleInterestCheck(args) {
  return new Response(JSON.stringify({
    status: "success",
    is_interested: args.is_interested || false
  }));
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
