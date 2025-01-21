import { WebClient } from '@slack/web-api';
import { Client } from "@hubspot/api-client";

const slackToken = import.meta.env.SLACK_BOT_TOKEN;
const hubspotToken = import.meta.env.HUBSPOT_ACCESS_TOKEN;

export const config = {
  runtime: 'edge',
};

const web = new WebClient(slackToken);
const hubspotClient = new Client({ accessToken: hubspotToken });

export async function POST({ request }: { request: Request }) {
    if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const { email, firstName, lastName, companyName, jobTitle } = await request.json();

        if (!email || !companyName) {
            return new Response('Email and company name are required', { status: 400 });
        }

        const domain = email.split('@')[1];
        const sanitizedCompanyName = companyName.trim();

        // Create company first
        let companyId;
        try {
            const companyResponse = await hubspotClient.crm.companies.basicApi.create({
                properties: {
                    name: sanitizedCompanyName,
                    domain: domain,
                    hubspot_owner_id: '1546319970',
                }
            });
            companyId = companyResponse.id;
        } catch (error) {
            console.error('HubSpot Company Creation Error:', error);
            throw error;
        }

        // Then create contact
        let contactId;
        try {
            const contactResponse = await hubspotClient.crm.contacts.basicApi.create({
                properties: {
                    email,
                    firstname: firstName,
                    lastname: lastName,
                    jobtitle: jobTitle,
                    company: sanitizedCompanyName,
                    lifecyclestage: 'opportunity',
                    hs_lead_status: 'IN_PROGRESS',
                    hubspot_owner_id: '1546319970',
                }
            });
            contactId = contactResponse.id;
        } catch (error) {
            console.error('HubSpot Contact Creation Error:', error);
            throw error;
        }

        // Create association
        if (contactId && companyId) {
            await fetch(`https://api.hubapi.com/crm/v4/associations/contacts/${contactId}/companies/${companyId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${hubspotToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    types: [{
                        associationCategory: 'HUBSPOT_DEFINED',
                        associationTypeId: 1
                    }]
                })
            });
        }

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