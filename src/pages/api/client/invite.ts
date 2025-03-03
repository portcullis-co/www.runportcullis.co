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
    const { email, firstName, lastName, companyName, companyDomain, annualRevenue, numOfEmployees, referralSource } = await request.json();
    const clientId = uuidv4();
    const domain = companyDomain;
    const channelName = `client-${domain.split('.')[0]}`.toLowerCase();
    const trialStart = new Date().toISOString();
    const trialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const company_logo = `https://img.logo.dev/${domain}?token=pk_AX6mV41DR6SElOfHFwkQdA`
    const annualRevenueFloat = parseFloat(annualRevenue) || 0;
    const numOfEmployeesInt = parseInt(numOfEmployees, 10) || 0;


    // Create private channel
    const channelResponse = await client.conversations.create({
      name: channelName,
      is_private: true
    });

    if (!channelResponse.ok || !channelResponse.channel?.id) {
      throw new Error(`Channel Creation Failed: ${channelResponse.error}`);
    }

    const channelId = channelResponse.channel.id;

    // Create multi-channel guest invite instead of Slack Connect
    const inviteResponse = await client.conversations.inviteShared({
      channel: channelId,
      emails: [email],
      external_limited: false,
    });

    // Add support team to channel
    await client.conversations.invite({
      channel: channelId,
      users: 'U07TUHW4NPL'
    });

    // Store client info
    await clickhouse.exec({
      query: `INSERT INTO Clients (id, intake_email, company, domain, channel_id, first_name, last_name, annual_revenue, num_of_employees, referral_source, trial_start, trial_end, company_logo) 
              VALUES ('${clientId}', '${email}', '${companyName}', '${domain}', '${channelId}', '${firstName}', '${lastName}', '${annualRevenueFloat}', '${numOfEmployeesInt}', '${referralSource}', '${trialStart}', '${trialEnd}', '${company_logo}')`,
      clickhouse_settings: {
        input_format_values_interpret_expressions: 0
      }
    });

    return new Response(JSON.stringify({ 
      ok: true,
      clientId,
      channelId
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
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
