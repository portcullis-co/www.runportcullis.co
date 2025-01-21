import { WebClient } from '@slack/web-api';
import { config } from 'dotenv';
import { Client } from "@hubspot/api-client";

// Load environment variables from .env file
config();

const slackToken = process.env.SLACK_BOT_TOKEN;
const web = new WebClient(slackToken);

const hubspotClient = new Client({
    accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
});

export async function POST({ request }: { request: Request }) {
    try {
        const { email, firstName, lastName, companyName, jobTitle } = await request.json();

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
            hubspot_owner_id: '1546319970'
        };

        const companyProperties = {
            name: companyName,
            domain: domain,
            hubspot_owner_id: '1546319970'
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

            if (!createChannelResponse.channel?.id) {
                throw new Error('Failed to create channel');
            }
            channelId = createChannelResponse.channel.id;
        }

        // Step 2: Invite yourself and your cofounder to the channel
        const userIds = ['U07TUHW4NPL', 'U07TX3KJG84']; // Replace with your and your cofounder's user IDs
        await web.conversations.invite({
            channel: channelId,
            users: userIds.join(','),
        });

        // Step 3: Send Slack Connect invite to the customer
        await web.conversations.inviteShared({
            channel: channelId,
            emails: [email],
        });

        console.log('Channel created or found, invites sent, and HubSpot records created successfully');
        return new Response(JSON.stringify({ message: 'Invitation sent successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error in invite process:', error);
        return new Response('Failed to process invitation', { status: 500 });
    }
}