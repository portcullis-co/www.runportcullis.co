import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRTVIClient, useRTVIClientEvent, VoiceVisualizer, RTVIClientAudio } from '@pipecat-ai/client-react';
import { RTVIEvent } from '@pipecat-ai/client-js';
import { CustomerInfoDialog } from './CustomerInfoDialog';
import { RTVIButtons } from './RTVIButtons';
import { useToast } from '@/components/ui/use-toast';

// Define the CustomerInfo interface
interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  domain: string;
  budget: string;
  needs: string;
  quoteOptIn: boolean;
}

// Zero-state management - Maximum responsiveness
export function PortcullisSessionView({ onLeave }: { onLeave: () => void }) {
  const client = useRTVIClient();
  const { toast } = useToast();
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [showCustomerInfoDialog, setShowCustomerInfoDialog] = useState(false);
  const [quoteSent, setQuoteSent] = useState(false);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [sseStatus, setSseStatus] = useState('');
  const [showTestingTools, setShowTestingTools] = useState(false);
  
  // Core function to trigger bot responses
  const triggerBotToSpeak = (text: string) => {
    if (!client) return;
    
    // Send message to LLM with proper format
    client.action({
      service: 'llm',
      action: 'generate',
      arguments: [{
        name: 'messages',
        value: [
          {
            role: 'user',
            content: text
          }
        ]
      }]
    })
  };

  // Setup SSE connection for real-time updates
  useEffect(() => {
    if (!eventSource) {
      // Create SSE connection
      const sse = new EventSource('/api/assistant/events');
      
      sse.onopen = () => {
        setSseStatus('connected');
      };
      
      sse.onerror = () => {
        setSseStatus('error');
        sse.close();
      };
      
      // Listen for interest_tagged event
      sse.addEventListener('interest_tagged', (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.interest_level && data.interest_level >= 7) {
            setShowCustomerInfoDialog(true);
          }
        } catch (error) {
          console.error('Error parsing interest_tagged event:', error);
        }
      });
      
      // Listen for quote_created event
      sse.addEventListener('quote_created', (event) => {
        try {
          const data = JSON.parse(event.data);
          setQuoteSent(true);
          toast({
            title: "Quote Created!",
            description: `A quote has been created and sent to ${data.customer_email || 'your email'}.`
          });
        } catch (error) {
          console.error('Error parsing quote_created event:', error);
        }
      });
      
      setEventSource(sse);
    }
    
    // Cleanup SSE connection
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  // Handle customer info submission
  const handleCustomerInfoSubmit = async (customerInfo: CustomerInfo) => {
    try {
      // Create customer in Hyperline
      const createCustomerResponse = await fetch('/api/hyperline/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          company: customerInfo.company,
          domain: customerInfo.domain
        })
      });
      
      if (!createCustomerResponse.ok) {
        throw new Error('Failed to create customer');
      }
      
      const customerData = await createCustomerResponse.json();
      
      // If customer opted in for quote, get products and create quote
      if (customerInfo.quoteOptIn) {
        // Get products from price book
        const getProductsResponse = await fetch('/api/hyperline/products?pricebook=prib_9-PbjlK4BzUSPR', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!getProductsResponse.ok) {
          throw new Error('Failed to get products');
        }
        
        const productsData = await getProductsResponse.json();
        
        // Create quote with the first product (or based on some logic)
        if (productsData.products && productsData.products.length > 0) {
          const createQuoteResponse = await fetch('/api/hyperline/quotes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              customerId: customerData.customer.id,
              description: customerInfo.needs || 'Portcullis services quote',
              products: [productsData.products[0].id], // Using first product as example
              budget: customerInfo.budget
            })
          });
          
          if (!createQuoteResponse.ok) {
            throw new Error('Failed to create quote');
          }
          
          setQuoteSent(true);
        }
      }
      
      // Notify the bot about the customer info
      triggerBotToSpeak(`Customer information has been collected for ${customerInfo.firstName} ${customerInfo.lastName} from ${customerInfo.company}. ${customerInfo.quoteOptIn ? 'They have requested a quote.' : 'They did not request a quote at this time.'}`);
      
      return true;
    } catch (error) {
      console.error('Error submitting customer info:', error);
      throw error;
    }
  };

  // The only event we need to handle is getting the transcript to send to the LLM
  useRTVIClientEvent(RTVIEvent.UserTranscript, (data: any) => {
    if (data?.text && data?.final) {
      triggerBotToSpeak(data.text);
    }
  });

  // Handle initial greeting
  useRTVIClientEvent(RTVIEvent.BotReady, () => {
    triggerBotToSpeak("Hello! I'm your Portcullis assistant. How can I help you today?");
  });

  // Track when user starts speaking
  useRTVIClientEvent(RTVIEvent.UserStartedSpeaking, () => {
    setIsUserSpeaking(true);
  });

  // Track when user stops speaking
  useRTVIClientEvent(RTVIEvent.UserStoppedSpeaking, () => {
    setIsUserSpeaking(false);
  });
  
  // Handle interest_tagged event from custom bot function calls
  useRTVIClientEvent(RTVIEvent.ServerMessage, (data: any) => {
    if (data?.type === 'function_call' && data?.name === 'check_interest') {
      if (data?.result?.interest_level && data?.result?.interest_level >= 7) {
        setShowCustomerInfoDialog(true);
      }
    }
  });

  // Toggle testing tools visibility
  const toggleTestingTools = () => {
    setShowTestingTools(!showTestingTools);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Portcullis AI Assistant</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleTestingTools}
            >
              {showTestingTools ? "Hide Testing Tools" : "Show Testing Tools"}
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={onLeave}
            >
              <LogOut className="h-4 w-4 mr-2" />
              End
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Voice Visualizer automatically connects to RTVI client */}
          <div className="w-full">
            <div className="text-center mb-2 text-sm font-medium">
              Portcullis Voice Assistant
              {isUserSpeaking && <span className="ml-2 text-green-500 animate-pulse">● User Speaking</span>}
            </div>
            <div className={`h-40 w-full flex items-center justify-center ${isUserSpeaking ? 'bg-gray-100' : 'bg-gray-50'} rounded-lg border ${isUserSpeaking ? 'border-green-300' : 'border-gray-200'} transition-colors duration-200`}>
              <VoiceVisualizer 
                participantType="bot"
                backgroundColor="transparent"
                barColor={isUserSpeaking ? "#22c55e" : "#000000"}
                barGap={4}
                barWidth={18}
                barMaxHeight={100}
              />
            </div>
          </div>

          {/* Essential audio component */}
          <RTVIClientAudio />
          
          {/* Status indicators */}
          {quoteSent && (
            <div className="bg-green-50 p-3 rounded-md text-green-700 text-sm">
              Quote created and sent! Check your email for details.
            </div>
          )}
          
          {sseStatus === 'error' && (
            <div className="bg-red-50 p-3 rounded-md text-red-700 text-sm">
              Connection error. Some features may not work properly.
            </div>
          )}
          
          {/* Testing tools section */}
          {showTestingTools && (
            <RTVIButtons />
          )}
        </CardContent>
        
        <CardFooter className="text-sm text-muted-foreground text-center">
          {isUserSpeaking ? "Listening..." : "Speak to interact with the assistant"}
        </CardFooter>
      </Card>
      
      {/* Customer Information Dialog */}
      <CustomerInfoDialog 
        isOpen={showCustomerInfoDialog}
        onClose={() => setShowCustomerInfoDialog(false)}
        onSubmit={handleCustomerInfoSubmit}
      />
    </>
  );
} 