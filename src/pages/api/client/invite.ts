import type { APIRoute } from "astro";
import { WebClient } from '@slack/web-api';
import { createClient } from '@clickhouse/client';
import { v4 as uuidv4 } from 'uuid';

const client = new WebClient(import.meta.env.SLACK_BOT_TOKEN);
const clickhouse = createClient({
  url: import.meta.env.CLICKHOUSE_HOST ?? 'http://localhost:8123',
  username: import.meta.env.CLICKHOUSE_USER ?? 'default',
  password: import.meta.env.CLICKHOUSE_PASSWORD ?? '',
  database: import.meta.env.CLICKHOUSE_DATABASE ?? 'default'
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, partnerId } = await request.json();
    const clientId = uuidv4(); // Generate new UUID for the client
    
    const domain = email.split('@')[1];
    const channelName = `client-${domain.split('.')[0]}`;

    // Create channel
    const channelResponse = await client.conversations.create({
      name: channelName,
      is_private: true
    });

    if (!channelResponse.ok || !channelResponse.channel?.id) {
      throw new Error(`Slack Channel Creation Failed: ${channelResponse.error}`);
    }

    const channelId = channelResponse.channel.id;

    // Add James to the channel
    await client.conversations.invite({
      channel: channelId,
      users: 'U07TUHW4NPL'
    });

    // Send detailed DM to James
    await client.chat.postMessage({
      channel: 'U07TUHW4NPL',
      text: `🎉 New client alert! ${email} has joined the portal in <#${channelId}>`
    });

    // Send Slack Connect invite
    const inviteResponse = await client.conversations.inviteShared({
      channel: channelId,
      emails: [email]
    });

    if (!inviteResponse.ok) {
      throw new Error(`Slack Connect Invite Failed: ${inviteResponse.error}`);
    }

    // Insert into clients table
    await clickhouse.exec({
      query: `INSERT INTO clients (id, intake_email, domain) VALUES ('${clientId}', '${email}', '${domain}')`,
      clickhouse_settings: {
        input_format_values_interpret_expressions: 0
      }
    });

    // If partnerId is provided, create referral record
    if (partnerId) {
      await clickhouse.exec({
        query: `INSERT INTO referrals (partner_id, client_id) VALUES ('${partnerId}', '${clientId}')`,
        clickhouse_settings: {
          input_format_values_interpret_expressions: 0
        }
      });
    }

    return new Response(JSON.stringify({ 
      ok: true,
      clientId,
      inviteId: inviteResponse.invite_id,
      channelId: channelId
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('API Error:', error);
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