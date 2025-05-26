import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

type MessageAction = 'like' | 'dislike' | 'copy';

interface MessageActionPayload {
  message_id: string;
  action: MessageAction;
  message_content: string;
  metadata?: {
    source_component?: string;
    context?: string;
    [key: string]: any;
  };
}

// Get environment variables - using direct access with proper error handling
const getEnvVar = (key: string): string => {
  const value = process.env[`NEXT_PUBLIC_${key}`] || process.env[key];
  if (!value) {
    console.error(`❌ Missing required environment variable: ${key}`);
    return '';
  }
  return value;
};

const supabaseUrl = getEnvVar('SUPABASE_URL');
const supabaseAnonKey = getEnvVar('SUPABASE_ANON_KEY');

// Only initialize if in browser or if we have the required variables
const isBrowser = typeof window !== 'undefined';
const hasRequiredVars = supabaseUrl && supabaseAnonKey;

let supabaseClient: any;

if (isBrowser || hasRequiredVars) {
  try {
    supabaseClient = createClient<Database>(
      supabaseUrl || 'https://jqaqkymjacdnllytexou.supabase.co',
      supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxYXFreW1qYWNkbmxseXRleG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNDM5MDYsImV4cCI6MjA2MjYxOTkwNn0.LoJMnX2qO945At_Gebd7khYGsttudBJfiiC-XzM3-8I',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      }
    );
    console.log('✅ Supabase client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error);
  }
} else {
  console.warn('⚠️ Supabase client not initialized - missing required environment variables');
}

export const supabase = supabaseClient;

export const saveFeedback = async (feedback: {
  message_id: string;
  is_positive: boolean;
  feedback_text?: string;
  message_content: string;
  message_metadata?: {
    message_type?: string;
    media_type?: string;
    tone?: string;
  };
  formatting_analysis?: {
    format_type: string;
    position_start: number;
    position_end: number;
    content: string;
    context_category?: string;
  }[];
}) => {
  try {
    // Get user ID if available, otherwise use null for anonymous feedback
    let userId = null;
    try {
      const { data: userData } = await supabase.auth.getUser();
      userId = userData.user?.id || null;
    } catch (authError) {
      console.log('No authenticated user, saving as anonymous feedback');
    }

    const { data, error } = await supabase
      .from('message_feedback')
      .insert({
        message_id: feedback.message_id,
        is_positive: feedback.is_positive,
        feedback_text: feedback.feedback_text,
        message_content: feedback.message_content,
        message_metadata: feedback.message_metadata || {},
        formatting_analysis: feedback.formatting_analysis || [],
        user_id: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving feedback:', error);
      throw error;
    }

    console.log('Feedback saved successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to save feedback:', error);
    throw error;
  }
};

export const getMessageFeedback = async (messageId: string) => {
  const { data, error } = await supabase
    .from('message_feedback')
    .select('*')
    .eq('message_id', messageId);

  if (error) {
    console.error('Error fetching feedback:', error);
    throw error;
  }

  return data;
};

/**
 * Logs a user action (like, dislike, copy) for a message
 */
export const logMessageAction = async ({
  message_id,
  action,
  message_content,
  metadata = {}
}: MessageActionPayload) => {
  try {
    // Get user ID if available
    let userId = null;
    try {
      const { data: userData } = await supabase.auth.getUser();
      userId = userData.user?.id || null;
    } catch (authError) {
      console.log('No authenticated user, logging action anonymously');
    }

    const { data, error } = await supabase
      .from('message_actions') // Make sure this table exists in your Supabase
      .insert({
        message_id,
        action_type: action,
        message_content,
        metadata: {
          ...metadata,
          user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
          timestamp: new Date().toISOString(),
        },
        user_id: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Error logging message action:', error);
      throw error;
    }

    console.log('Message action logged successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to log message action:', error);
    throw error;
  }
};

// Helper functions for specific actions
export const logLike = (messageId: string, messageContent: string, metadata = {}) => 
  logMessageAction({
    message_id: messageId,
    action: 'like',
    message_content: messageContent,
    metadata
  });

export const logDislike = (messageId: string, messageContent: string, metadata = {}) => 
  logMessageAction({
    message_id: messageId,
    action: 'dislike',
    message_content: messageContent,
    metadata
  });

export const logCopy = (messageId: string, messageContent: string, metadata = {}) => 
  logMessageAction({
    message_id: messageId,
    action: 'copy',
    message_content: messageContent,
    metadata: {
      ...metadata,
      copied_at: new Date().toISOString()
    }
  });
