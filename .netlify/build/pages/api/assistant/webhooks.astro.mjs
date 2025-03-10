import twilio from "twilio";
import { renderers } from "../../../renderers.mjs";
const twilioClient = twilio(
  "ACb9b8bf0e399826b38b326efd34765d1c",
  "41c4e9bb1c2ee42d37a93b8c39cd8a67"
);
const HYPERLINE_API_BASE = "https://api.hyperline.co/v1";
const HYPERLINE_API_KEY = void 0;
const INVOICING_ENTITY_ID = "ive_default";
const MEETING_LINK = "https://cal.com/team/portcullis/portcullis-intro";
const POST = async ({ request }) => {
  try {
    const data = await request.json();
    console.log("Webhook received:", data);
    const { tool_name, parameters } = data;
    let responseData = {};
    switch (tool_name) {
      case "provide_quote":
        responseData = await handleQuoteRequest(parameters);
        break;
      case "collect_qualification_info":
        responseData = {
          success: true,
          message: "Information collected successfully",
          next_steps: "This information will be used to prepare your personalized quote."
        };
        break;
      case "check_interest":
        responseData = {
          success: true,
          message: "Interest recorded",
          suggestion: "Would you like me to prepare a quote based on your needs?"
        };
        break;
      default:
        return new Response(
          JSON.stringify({
            error: "Unknown tool",
            message: `Tool '${tool_name}' is not supported`
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
    }
    return new Response(
      JSON.stringify(responseData),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: errorMessage
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
};
async function handleQuoteRequest(params) {
  try {
    const customerNeeds = {
      email: params.email,
      name: params.name,
      company: params.company || params.name + "'s Company",
      dataWarehouse: params.data_warehouse,
      projectStatus: params.project_status,
      budget: params.budget,
      requirements: params.requirements || [],
      teamSize: params.team_size,
      phone: params.phone
    };
    console.log("Processing quote for customer:", customerNeeds);
    const products = await getHyperlineProducts();
    console.log(`Retrieved ${products.length} products from Hyperline`);
    const recommendedProduct = selectProductForCustomer(customerNeeds, products);
    console.log("Recommended product:", recommendedProduct?.name);
    if (!recommendedProduct) {
      return {
        success: false,
        message: "Couldn't find a suitable product match. Please contact sales directly."
      };
    }
    const customer = await createHyperlineCustomer(customerNeeds);
    console.log("Created customer in Hyperline:", customer.id);
    const quote = await createAndSendQuote(customer, recommendedProduct, customerNeeds);
    console.log("Quote created and sent:", quote.id);
    let smsResult = null;
    if (customerNeeds.phone) {
      smsResult = await sendMeetingLinkViaSMS(customerNeeds.phone);
      console.log("SMS with meeting link sent:", smsResult);
    }
    return {
      success: true,
      quote: {
        id: quote.id,
        product: recommendedProduct.name,
        customer_id: customer.id,
        url: quote.url,
        expires_at: quote.expires_at,
        amount: quote.amount
      },
      meeting_link: MEETING_LINK,
      message: `Your personalized quote has been sent to ${customerNeeds.email}. We've also included a link to schedule a meeting with our team.`
    };
  } catch (error) {
    console.error("Error handling quote request:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      message: "We couldn't process your quote at this time. Please try again or contact our sales team directly."
    };
  }
}
async function getHyperlineProducts() {
  try {
    const response = await fetch(`${HYPERLINE_API_BASE}/products`, {
      headers: {
        "Authorization": `Bearer ${HYPERLINE_API_KEY}`,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    const data = await response.json();
    const productsWithPricing = (data.data || []).map((product) => {
      let pricing = {};
      switch (product.id) {
        case "itm_Lwdf42vy6z1voE":
          pricing = { flat_fee: 5200 };
          break;
        case "itm_DGblPGNRYp9Fu7":
          pricing = { flat_fee: 13e3 };
          break;
        case "itm_7YYk9dyW1dcWGg":
          pricing = { monthly: 97.5, annual: 1170 };
          break;
        case "itm_rjHTRIERIpOUnQ":
          pricing = { flat_fee: 23e3 };
          break;
        case "itm__kaVtWZoXa0olZ":
          pricing = { flat_fee: 1200 };
          break;
      }
      return {
        ...product,
        price_configuration: pricing
      };
    });
    return productsWithPricing;
  } catch (error) {
    console.error("Error fetching Hyperline products:", error);
    return [
      {
        id: "itm_Lwdf42vy6z1voE",
        name: "Content Writing",
        description: "Package of 10 blog posts about your choice of data engineering topic",
        price_configuration: { flat_fee: 5200 }
      },
      {
        id: "itm_DGblPGNRYp9Fu7",
        name: "Dashboard Creation",
        description: "Shadcn and Streamlit dashboard creation for your data warehouse",
        price_configuration: { flat_fee: 13e3 }
      },
      {
        id: "itm_7YYk9dyW1dcWGg",
        name: "Insights",
        description: "Advisory steering support for realtime data engineering projects",
        price_configuration: { monthly: 97.5, annual: 1170 }
      },
      {
        id: "itm_rjHTRIERIpOUnQ",
        name: "Realtime Voice AI Build",
        description: "A custom realtime voice AI build for your company",
        price_configuration: { flat_fee: 23e3 }
      },
      {
        id: "itm__kaVtWZoXa0olZ",
        name: "Steering Report",
        description: "We will help you plan your POC and things such as build/buy reports",
        price_configuration: { flat_fee: 1200 }
      }
    ];
  }
}
function selectProductForCustomer(customerNeeds, products) {
  if (!products || products.length === 0) {
    return null;
  }
  const scores = products.map((product) => {
    let score = 0;
    const needsDashboard = customerNeeds.requirements?.some((req) => req.toLowerCase().includes("dashboard") || req.toLowerCase().includes("visualization") || req.toLowerCase().includes("streamlit") || req.toLowerCase().includes("shadcn"));
    const needsContent = customerNeeds.requirements?.some((req) => req.toLowerCase().includes("blog") || req.toLowerCase().includes("content") || req.toLowerCase().includes("writing") || req.toLowerCase().includes("post"));
    const needsVoiceAI = customerNeeds.requirements?.some((req) => req.toLowerCase().includes("voice") || req.toLowerCase().includes("ai") || req.toLowerCase().includes("chat") || req.toLowerCase().includes("assistant"));
    const needsPlanning = customerNeeds.requirements?.some((req) => req.toLowerCase().includes("poc") || req.toLowerCase().includes("plan") || req.toLowerCase().includes("report") || req.toLowerCase().includes("build/buy"));
    const needsAdvisory = customerNeeds.requirements?.some((req) => req.toLowerCase().includes("advisory") || req.toLowerCase().includes("steering") || req.toLowerCase().includes("support") || req.toLowerCase().includes("ongoing"));
    switch (product.id) {
      case "itm_Lwdf42vy6z1voE":
        if (needsContent) score += 10;
        break;
      case "itm_DGblPGNRYp9Fu7":
        if (needsDashboard) score += 10;
        if (needsDashboard && customerNeeds.dataWarehouse) score += 5;
        break;
      case "itm_7YYk9dyW1dcWGg":
        if (needsAdvisory) score += 10;
        if (customerNeeds.projectStatus?.toLowerCase().includes("ongoing")) score += 5;
        break;
      case "itm_rjHTRIERIpOUnQ":
        if (needsVoiceAI) score += 10;
        break;
      case "itm__kaVtWZoXa0olZ":
        if (needsPlanning) score += 10;
        if (customerNeeds.projectStatus?.toLowerCase().includes("planning") || customerNeeds.projectStatus?.toLowerCase().includes("early")) score += 5;
        break;
    }
    if (customerNeeds.budget) {
      const budgetNum = typeof customerNeeds.budget === "string" ? parseInt(customerNeeds.budget.replace(/[^0-9]/g, "")) : customerNeeds.budget;
      const productPrice = product.price_configuration?.flat_fee || product.price_configuration?.monthly * 12 || product.price_configuration?.annual;
      if (productPrice <= budgetNum) {
        score += 5;
      } else if (productPrice > budgetNum) {
        score -= 5;
      }
    }
    if (customerNeeds.requirements) {
      for (const req of customerNeeds.requirements) {
        if (product.description.toLowerCase().includes(req.toLowerCase())) {
          score += 2;
        }
      }
    }
    if (customerNeeds.dataWarehouse && product.description.toLowerCase().includes("data warehouse")) {
      score += 3;
    }
    return { product, score };
  });
  scores.sort((a, b) => b.score - a.score);
  console.log("Product scores:", scores.map((s) => `${s.product.name}: ${s.score}`));
  if (scores.length > 0 && scores[0].score > 0) {
    return scores[0].product;
  }
  const insightsProduct = products.find((p) => p.id === "itm_7YYk9dyW1dcWGg");
  if (insightsProduct) {
    return insightsProduct;
  }
  return products[0];
}
async function createHyperlineCustomer(customerNeeds) {
  try {
    const response = await fetch(`${HYPERLINE_API_BASE}/customers`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HYPERLINE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: customerNeeds.name,
        email: customerNeeds.email,
        company_name: customerNeeds.company,
        phone: customerNeeds.phone,
        custom_properties: {
          data_warehouse: customerNeeds.dataWarehouse,
          project_status: customerNeeds.projectStatus,
          team_size: customerNeeds.teamSize,
          requirements: customerNeeds.requirements?.join(", ")
        }
      })
    });
    if (!response.ok) {
      throw new Error(`Failed to create customer: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating Hyperline customer:", error);
    return {
      id: `cus_${Date.now().toString(36)}`,
      email: customerNeeds.email,
      name: customerNeeds.name
    };
  }
}
async function createAndSendQuote(customer, product, customerNeeds) {
  try {
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    const isSubscription = product.id === "itm_7YYk9dyW1dcWGg";
    const billingPreference = customerNeeds.requirements?.some((req) => req.toLowerCase().includes("annual") || req.toLowerCase().includes("yearly")) ? "annual" : "monthly";
    const amount = isSubscription ? product.price_configuration?.[billingPreference] || 97.5 : product.price_configuration?.flat_fee || 1200;
    const quoteBody = {
      status: "draft",
      owner_email: "sales@runportcullis.co",
      customer_id: customer.id,
      invoicing_entity_id: INVOICING_ENTITY_ID,
      comments: `Thank you for your interest in Portcullis! Based on your needs, we recommend our ${product.name} service. You can also schedule a meeting with us here: ${MEETING_LINK}`,
      terms: "By signing this quote, you accept our terms of service.",
      amount: amount * 100,
      // Convert to cents
      collect_payment_details: true,
      automatically_start_subscription: isSubscription,
      expires_at: expiresAt.toISOString()
    };
    if (isSubscription) {
      quoteBody.type = "subscription";
      quoteBody.subscription = {
        commitment_interval: {
          period: billingPreference === "annual" ? "years" : "months",
          count: 1
        },
        renew_automatically: true,
        phases: [
          {
            products: [
              {
                id: product.id,
                name: product.name,
                description: product.description,
                payment_interval: {
                  period: billingPreference === "annual" ? "years" : "months",
                  count: 1
                },
                price: {
                  type: "fee",
                  amount: amount * 100
                  // Convert to cents
                }
              }
            ]
          }
        ]
      };
    } else {
      quoteBody.type = "one_off";
      quoteBody.products = [
        {
          id: product.id,
          name: product.name,
          description: product.description,
          price: amount * 100,
          // Convert to cents
          quantity: 1
        }
      ];
    }
    const quoteResponse = await fetch(`${HYPERLINE_API_BASE}/quotes`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HYPERLINE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quoteBody)
    });
    if (!quoteResponse.ok) {
      throw new Error(`Failed to create quote: ${quoteResponse.status}`);
    }
    const quote = await quoteResponse.json();
    const sendResponse = await fetch(`${HYPERLINE_API_BASE}/quotes/${quote.id}/send`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HYPERLINE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: customer.email,
        subject: `Your Portcullis ${product.name} Quote`,
        message: `Hello ${customer.name},

Thank you for your interest in Portcullis! We've prepared a quote for our ${product.name} service based on your needs.

You can also schedule a meeting with us here: ${MEETING_LINK}

Looking forward to working with you,
The Portcullis Team`
      })
    });
    if (!sendResponse.ok) {
      throw new Error(`Failed to send quote: ${sendResponse.status}`);
    }
    return quote;
  } catch (error) {
    console.error("Error creating/sending quote:", error);
    return {
      id: `quo_${Date.now().toString(36)}`,
      url: `https://billing.hyperline.co/quote/quo_${Date.now().toString(36)}`,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString(),
      amount: product.price_configuration?.flat_fee || product.price_configuration?.monthly || 1200 * 100
    };
  }
}
async function sendMeetingLinkViaSMS(phone) {
  try {
    return await twilioClient.messages.create({
      from: "+18444354338",
      to: phone,
      body: `Thank you for your interest in Portcullis! Here's a link to schedule a meeting with our team: ${MEETING_LINK}`
    });
  } catch (error) {
    console.error("Error sending SMS:", error);
    return null;
  }
}
const OPTIONS = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
