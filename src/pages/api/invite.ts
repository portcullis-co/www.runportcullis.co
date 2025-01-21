import { WebClient } from '@slack/web-api';
import { Client } from "@hubspot/api-client";

export const config = {
  runtime: 'edge',
};

const slackToken = process.env.SLACK_BOT_TOKEN;
const web = new WebClient(slackToken);

const hubspotClient = new Client({
    accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
});

export async function POST({ request }: { request: Request }) {
    if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const { email, firstName, lastName, companyName, jobTitle, turnstileToken, consent } = await request.json();

        // Verify Turnstile token
        const turnstileResponse = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    secret: process.env.TURNSTILE_SECRET_KEY,
                    response: turnstileToken,
                }),
            }
        );

        const turnstileData = await turnstileResponse.json();
        if (!turnstileData.success) {
            return new Response("Invalid Turnstile token", { status: 400 });
        }

        if (!email) {
            return new Response('Email parameter is required', { status: 400 });
        }

        // Create or update contact in HubSpot
        const domain = email.split('@')[1];
        const contactProperties = {
            email,
            firstname: firstName,
            lastname: lastName,
            jobtitle: jobTitle,
            lifecyclestage: 'opportunity',
            hs_lead_status: 'IN_PROGRESS',
            hubspot_owner_id: '1546319970',
            consent: consent
        };

        const companyProperties = {
            name: companyName,
            domain: domain,
            hubspot_owner_id: '1546319970',
            consent: consent
        };

        try {
            // Create/Update Contact
            const contactResponse = await hubspotClient.crm.contacts.basicApi.create({
                properties: contactProperties
            });
            
            // Create Company if it doesn't exist
            const companyResponse = await hubspotClient.crm.companies.basicApi.create({
                properties: companyProperties
            });

            // Associate Contact with Company
            await fetch(`https://api.hubapi.com/crm/v4/associations/contacts/${contactResponse.id}/companies/${companyResponse.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    types: [{
                        associationCategory: 'HUBSPOT_DEFINED',
                        associationTypeId: 1
                    }]
                })
            });
        } catch (hubspotError) {
            console.error('HubSpot Error:', hubspotError);
            // Continue with Slack invite even if HubSpot fails
        }

        // Extract company name from email domain for Slack channel


        // Step 1: Create a private channel with the name format `connect-{companyName}`
        const channelName = `connect-${companyName.toLowerCase()}`;
        const listResponse = await web.conversations.list();
        const existingChannel = listResponse.channels?.find(channel => channel.name === channelName);

        let channelId: string;
        if (existingChannel) {
            channelId = existingChannel.id!;
            console.log(`Channel ${channelName} already exists.`);
        } else {
            const createChannelResponse = await web.conversations.create({
                name: channelName,
                is_private: true,
            });
            channelId = createChannelResponse.channel?.id!;
        }

        // Invite team members
        const userIds = ['U07TUHW4NPL', 'U07TX3KJG84'];
        await web.conversations.invite({
            channel: channelId,
            users: userIds.join(','),
        });

        // Send Slack Connect invite
        await web.conversations.inviteShared({
            channel: channelId,
            emails: [email],
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}