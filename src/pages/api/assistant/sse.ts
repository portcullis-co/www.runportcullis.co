import type { APIRoute } from 'astro';

let connections = new Set<ResponseWithContext>();

// Extended Response type with context for managing connections
interface ResponseWithContext extends Response {
  clientId?: string;
  controller?: ReadableStreamDefaultController;
}

// Helper to send SSE messages to all clients
function broadcast(event: string, data: any) {
  connections.forEach((client) => {
    client.controller?.enqueue(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  });
}

export const GET: APIRoute = async ({ request }) => {
  // Create a unique ID for this connection
  const clientId = crypto.randomUUID();
  let controller: ReadableStreamDefaultController;
  
  // Create a ReadableStream for the SSE connection
  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl;
      
      // Send an initial connection message
      controller.enqueue(`event: connected\ndata: {"status": "connected", "clientId": "${clientId}"}\n\n`);
      
      console.log(`SSE client connected: ${clientId}`);
    },
    cancel() {
      // Remove the connection when the client disconnects
      connections = new Set([...connections].filter(conn => conn.clientId !== clientId));
      console.log(`SSE client disconnected: ${clientId}`);
    }
  });
  
  // Create the response with context
  const response = new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    }
  }) as ResponseWithContext;
  
  // Add client context to the response
  response.clientId = clientId;
  response.controller = controller!;
  
  // Add the connection to our set
  connections.add(response);
  
  return response;
};

// Add OPTIONS handler for CORS preflight requests
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};

// Export the broadcast function so it can be used from other API routes
export { broadcast }; 