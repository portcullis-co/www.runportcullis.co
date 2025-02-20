import type { APIRoute } from "astro";
import { WebClient } from '@slack/web-api';
import { Client } from '@hubspot/api-client';

const client = new WebClient(import.meta.env.SLACK_BOT_TOKEN);

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();
    
    // Extract domain from email
    const domain = email.split('@')[1];
    const channelName = `client-${domain.split('.')[0]}`;
    const hubspot = new Client({ accessToken: import.meta.env.HUBSPOT_ACCESS_TOKEN });

    // Create channel
    const channelResponse = await client.conversations.create({
      name: channelName,
      is_private: true
    });

    if (!channelResponse.ok || !channelResponse.channel?.id) {
      throw new Error('Failed to create channel');
    }

    // Send Slack Connect invite
    const inviteResponse = await client.conversations.inviteShared({
      channel: channelResponse.channel.id,
      emails: [email],
      external_limited: false // Give full access to the channel
    });

    if (!inviteResponse.ok) {
      throw new Error('Failed to send invite');
    }

    return new Response(JSON.stringify({
      ok: true,
      channelId: channelResponse.channel.id,
      inviteId: inviteResponse.invite_id
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({
      ok: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 