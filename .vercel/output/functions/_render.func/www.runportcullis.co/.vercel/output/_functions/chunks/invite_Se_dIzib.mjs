import { WebClient } from '@slack/web-api';
import { Client } from '@hubspot/api-client';

const config = {
  runtime: "edge"
};
const slackToken = process.env.SLACK_BOT_TOKEN;
const web = new WebClient(slackToken);
const hubspotClient = new Client({
  accessToken: process.env.HUBSPOT_ACCESS_TOKEN
});
async function handler(request) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  try {
    const { email, firstName, lastName, companyName, jobTitle } = await request.json();
    if (!email) {
      return new Response("Email parameter is required", { status: 400 });
    }
    const domain = email.split("@")[1];
    const contactProperties = {
      email,
      firstname: firstName,
      lastname: lastName,
      jobtitle: jobTitle,
      lifecyclestage: "opportunity",
      hs_lead_status: "IN_PROGRESS",
      hubspot_owner_id: "1546319970"
    };
    const companyProperties = {
      name: companyName,
      domain,
      hubspot_owner_id: "1546319970"
    };
    try {
      const contactResponse = await hubspotClient.crm.contacts.basicApi.create({
        properties: contactProperties
      });
      const companyResponse = await hubspotClient.crm.companies.basicApi.create({
        properties: companyProperties
      });
      await fetch(`https://api.hubapi.com/crm/v4/associations/contacts/${contactResponse.id}/companies/${companyResponse.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          types: [{
            associationCategory: "HUBSPOT_DEFINED",
            associationTypeId: 1
          }]
        })
      });
    } catch (hubspotError) {
      console.error("HubSpot Error:", hubspotError);
    }
    const channelName = `connect-${companyName.toLowerCase()}`;
    const listResponse = await web.conversations.list();
    const existingChannel = listResponse.channels?.find((channel) => channel.name === channelName);
    let channelId;
    if (existingChannel) {
      channelId = existingChannel.id;
      console.log(`Channel ${channelName} already exists.`);
    } else {
      const createChannelResponse = await web.conversations.create({
        name: channelName,
        is_private: true
      });
      channelId = createChannelResponse.channel?.id;
    }
    const userIds = ["U07TUHW4NPL", "U07TX3KJG84"];
    await web.conversations.invite({
      channel: channelId,
      users: userIds.join(",")
    });
    await web.conversations.inviteShared({
      channel: channelId,
      emails: [email]
    });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}

export { config, handler as default };
