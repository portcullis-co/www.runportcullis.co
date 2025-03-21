import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const response = await fetch(
      'https://api.pipecat.daily.co/v1/public/porticia/start',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.PIPECAT_CLOUD_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          createDailyRoom: true,
          body: {},
        }),
      }
    );

    const data = await response.json();

    // Transform the response to match what RTVI client expects
    return new Response(
      JSON.stringify({
        room_url: data.dailyRoom,
        token: data.dailyToken,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to start agent' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};