import { WebClient } from '@slack/web-api';
import { createClient } from '@supabase/supabase-js';

// Initialize Slack client
const slack = new WebClient(import.meta.env.SLACK_BOT_TOKEN);
const SLACK_CHANNEL_ID = import.meta.env.SLACK_CHANNEL_ID;

// Initialize Supabase client
const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Save a new message to Supabase and post it to Slack
 */
export async function saveMessage(customerId: string, content: string, threadId?: string) {
  try {
    // First, get the user to ensure we have the right threadId
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('thread_id')
      .eq('user_id', customerId)
      .single();
    
    if (userError) throw userError;
    
    if (!user) {
      throw new Error(`User not found: ${customerId}`);
    }
    
    // Use the provided threadId or the one from the user record
    const messageThreadId = threadId || user.thread_id;
    
    if (!messageThreadId) {
      throw new Error(`No thread ID found for user: ${customerId}`);
    }
    
    // Create a unique ID for the message
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();
    
    // Save message to Supabase
    const { error: insertError } = await supabase
      .from('messages')
      .insert({
        id: messageId,
        customer_id: customerId,
        channel_id: SLACK_CHANNEL_ID,
        content,
        created_at: now,
        updated_at: now
      });
      
    if (insertError) throw insertError;
    
    // Send to Slack as a thread reply
    await slack.chat.postMessage({
      channel: SLACK_CHANNEL_ID,
      thread_ts: messageThreadId,
      text: content
    });
    
    return { messageId, threadId: messageThreadId };
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
}

/**
 * Get all messages for a specific user/thread
 */
export async function getMessages(customerId: string) {
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return messages || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}