// src/pages/api/slack.ts
import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request }) => {
  const { channelName, message } = await request.json();

  const slackToken = 'YOUR_SLACK_BOT_TOKEN';
  const slackChannel = channelName;

  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${slackToken}`,
    },
    body: JSON.stringify({
      channel: slackChannel,
      text: message,
    }),
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};