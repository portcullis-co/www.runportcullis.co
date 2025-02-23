import type { APIRoute } from "astro";
import { createClient } from '@clickhouse/client-web';

const client = createClient({
  host: import.meta.env.CLICKHOUSE_HOST ?? 'http://localhost:8123',
  username: import.meta.env.CLICKHOUSE_USER ?? 'default',
  password: import.meta.env.CLICKHOUSE_PASSWORD ?? '',
  database: import.meta.env.CLICKHOUSE_DATABASE ?? 'default',
});

interface ClientData {
  id: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, domain, partnerId } = await request.json();

    // Generate client ID
    const clientId = crypto.randomUUID();

    // Create client record
    await client.query({
      query: `
        INSERT INTO clients (id, domain, billing_email)
        VALUES ({client_id: String}, {domain: String}, {email: String})
      `,
      query_params: {
        client_id: clientId,
        domain,
        email
      }
    });

    // Use clientId directly for further operations
    // Create referral record
    await client.query({
      query: `
        INSERT INTO referrals (partner_id, client_id)
        VALUES ({partner_id: UUID}, {client_id: UUID})
      `,
      query_params: {
        partner_id: partnerId,
        client_id: clientId
      }
    });

    return new Response(JSON.stringify({
      ok: true,
      clientId
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({
      ok: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 