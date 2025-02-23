import type { APIRoute } from "astro";
import { createClient } from '@clickhouse/client';
import { v4 as uuidv4 } from 'uuid';

const client = createClient({
  host: import.meta.env.CLICKHOUSE_HOST ?? 'http://localhost:8123',
  username: import.meta.env.CLICKHOUSE_USER ?? 'default',
  password: import.meta.env.CLICKHOUSE_PASSWORD ?? '',
  database: import.meta.env.CLICKHOUSE_DATABASE ?? 'default',
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, domain, partnerId, referralCode } = await request.json();
    const clientId = uuidv4();

    // Insert into clients table using native format
    await client.exec({
      query: `INSERT INTO clients (id, intake_email, domain) VALUES ('${clientId}', '${email}', '${domain}')`,
      clickhouse_settings: {
        input_format_values_interpret_expressions: 0
      }
    });

    // Insert into referrals table using native format
    await client.exec({
      query: `INSERT INTO referrals (partner_id, client_id) VALUES ('${partnerId}', '${clientId}')`,
      clickhouse_settings: {
        input_format_values_interpret_expressions: 0
      }
    });

    return new Response(
      JSON.stringify({ 
        ok: true,
        clientId
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error: any) {
    console.error('Error creating referral:', error);
    return new Response(
      JSON.stringify({
        ok: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}; 