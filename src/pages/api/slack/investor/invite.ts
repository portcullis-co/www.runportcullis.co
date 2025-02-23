import type { APIRoute } from "astro";
import { WebClient } from '@slack/web-api';

const client = new WebClient(import.meta.env.SLACK_BOT_TOKEN);

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();
    
    // Extract domain from email
    const domain = email.split('@')[1];
    const channelName = `investor-${domain.split('.')[0]}`;
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
      text: `🎉 New investor alert! ${email} has joined the portal in <#${channelId}>`
    });

    // Send Slack Connect invite
    const inviteResponse = await client.conversations.inviteShared({
      channel: channelId,
      emails: [email]
    });

    if (!inviteResponse.ok) {
      throw new Error(`Slack Connect Invite Failed: ${inviteResponse.error}`);
    }

    return new Response(JSON.stringify({ 
      ok: true,
      inviteId: inviteResponse.invite_id,
      channelId: channelId
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
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