import React from 'react';
import { Button } from '@/components/ui/button';
import { useRTVIClient } from '@pipecat-ai/client-react';
import { broadcast } from '../../../pages/api/assistant/events';

export function RTVIButtons() {
  const client = useRTVIClient();

  // Simulate high interest to trigger the form
  const triggerHighInterest = () => {
    if (!client) return;
    
    // Use SSE broadcast since client.sendMessage may have type restrictions
    broadcast('interest_tagged', {
      interest_level: 8,
      product: "Data Warehouse Optimization",
      notes: "Customer expressed strong interest in data warehouse optimization"
    });
    
    // Also notify the user via the bot
    client.action({
      service: 'llm',
      action: 'generate',
      arguments: [{
        name: 'messages',
        value: [
          {
            role: 'user',
            content: "I'm very interested in your data warehouse optimization services. Can you tell me more about pricing?"
          }
        ]
      }]
    }).catch(err => console.error('Error sending high interest message:', err));
  };

  // Simulate moderate interest (below threshold)
  const triggerModerateInterest = () => {
    if (!client) return;
    
    broadcast('interest_tagged', {
      interest_level: 5,
      product: "Data Security and Governance",
      notes: "Customer has some interest but wants to learn more"
    });
    
    // Also notify the user via the bot
    client.action({
      service: 'llm',
      action: 'generate',
      arguments: [{
        name: 'messages',
        value: [
          {
            role: 'user',
            content: "I'm somewhat interested in your data security services, but I need to learn more details before deciding."
          }
        ]
      }]
    }).catch(err => console.error('Error sending moderate interest message:', err));
  };

  // Simulate quote creation confirmation
  const simulateQuoteSent = () => {
    broadcast('quote_created', {
      quote_id: "quote_" + Math.random().toString(36).substring(2, 9),
      customer_id: "cust_" + Math.random().toString(36).substring(2, 9),
      customer_name: "Test Customer",
      customer_email: "test@example.com"
    });
  };

  return (
    <div className="flex flex-col space-y-2 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-sm font-medium mb-2">Testing Tools</h3>
      <div className="flex flex-wrap gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={triggerHighInterest}
        >
          Simulate High Interest
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={triggerModerateInterest}
        >
          Simulate Moderate Interest
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={simulateQuoteSent}
        >
          Simulate Quote Sent
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        These buttons simulate events for testing the customer information flow
      </p>
    </div>
  );
} 