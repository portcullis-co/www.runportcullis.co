export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  const slackToken = process.env.SLACK_BOT_TOKEN;
  const hubspotToken = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!slackToken || !hubspotToken) {
    console.error("Environment variables not found", {
      hasSlackToken: !!slackToken,
      hasHubspotToken: !!hubspotToken
    });
    return new Response(JSON.stringify({ error: "Configuration error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }
    const contentType = request.headers.get("content-type");
    let email, firstName, lastName, companyName, jobTitle;
    const tokenPreview = hubspotToken ? `${hubspotToken.slice(0, 4)}...${hubspotToken.slice(-4)}` : "undefined";
    console.log("HubSpot Token Preview:", tokenPreview);
    if (contentType?.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      const text = formData.get("text");
      if (!text || text.trim() === "") {
        return new Response(JSON.stringify({
          response_type: "ephemeral",
          text: "How to use `/invite`:\n```/invite email firstName lastName companyName jobTitle```\nExample:\n```/invite jane@acme.com Jane Smith Acme CTO```"
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      [email, firstName, lastName, companyName, jobTitle] = text.split(" ");
      console.log("Parsed Slack command:", { email, firstName, lastName, companyName, jobTitle });
    } else {
      const data = await request.json();
      ({ email, firstName, lastName, companyName, jobTitle } = data);
    }
    const domain = email.split("@")[1];
    const sanitizedCompanyName = companyName.trim();
    const companyResponse = await fetch("https://api.hubapi.com/crm/v3/objects/companies", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hubspotToken}`,
        "Content-Type": "application/json",
        "accept": "application/json"
      },
      body: JSON.stringify({
        properties: {
          name: sanitizedCompanyName,
          domain,
          hubspot_owner_id: "1546319970"
        }
      })
    });
    if (!companyResponse.ok) {
      const error = await companyResponse.text();
      console.error("HubSpot Company Creation Failed:", error);
      throw new Error(`HubSpot Company Creation Failed: ${error}`);
    }
    const companyData = await companyResponse.json();
    const companyId = companyData.id;
    console.log("Company created:", companyId);
    const contactResponse = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hubspotToken}`,
        "Content-Type": "application/json",
        "accept": "application/json"
      },
      body: JSON.stringify({
        properties: {
          email,
          firstname: firstName,
          lastname: lastName,
          jobtitle: jobTitle,
          company: sanitizedCompanyName,
          lifecyclestage: "opportunity",
          hs_lead_status: "IN_PROGRESS",
          hubspot_owner_id: "1546319970"
        }
      })
    });
    if (!contactResponse.ok) {
      const error = await contactResponse.text();
      console.error("HubSpot Contact Creation Failed:", error);
      throw new Error(`HubSpot Contact Creation Failed: ${error}`);
    }
    const contactData = await contactResponse.json();
    const contactId = contactData.id;
    console.log("Contact created:", contactId);
    const channelName = `connect-${sanitizedCompanyName.toLowerCase().replace(/[^a-z0-9-]/g, "-")}`;
    console.log("Creating Slack channel:", channelName);
    const createChannelResponse = await fetch("https://slack.com/api/conversations.create", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${slackToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: channelName,
        is_private: true
      })
    });
    const channelData = await createChannelResponse.json();
    if (!channelData.ok) {
      console.error("Slack Channel Creation Failed:", channelData.error);
      throw new Error(`Slack Channel Creation Failed: ${channelData.error}`);
    }
    const channelId = channelData.channel?.id;
    console.log("Channel created:", channelId);
    const inviteResponse = await fetch("https://slack.com/api/conversations.invite", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${slackToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        channel: channelId,
        users: "U07TUHW4NPL,U07TX3KJG84"
      })
    });
    const inviteData = await inviteResponse.json();
    if (!inviteData.ok) {
      console.error("Slack Invite Failed:", inviteData.error);
      throw new Error(`Slack Invite Failed: ${inviteData.error}`);
    }
    const connectInviteResponse = await fetch("https://slack.com/api/conversations.inviteShared", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${slackToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        channel: channelId,
        emails: [email]
      })
    });
    const connectInviteData = await connectInviteResponse.json();
    if (!connectInviteData.ok) {
      console.error("Slack Connect Invite Failed:", connectInviteData.error);
      throw new Error(`Slack Connect Invite Failed: ${connectInviteData.error}`);
    }
    return new Response(JSON.stringify({
      success: true,
      message: `Created channel ${channelName} and sent invite to ${email}`
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
