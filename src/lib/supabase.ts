import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Get environment variables - using direct access since we know they're in Netlify
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Throw clear error if environment variables are missing
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = [
    '\n\n========================================',
    'MISSING SUPABASE CONFIGURATION',
    '========================================',
    'Please ensure the following environment variables are set in Netlify:',
    '- NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL',
    '- NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY',
    '\nCurrent environment:',
    `- NODE_ENV: ${process.env.NODE_ENV}`,
    `- SUPABASE_URL: ${supabaseUrl ? 'SET' : 'MISSING'}`,
    `- SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'SET' : 'MISSING'}`,
    '========================================\n',
  ].join('\n');
  
  console.error(errorMessage);
  throw new Error('Missing Supabase configuration. Check the logs for details.');
}

// Initialize Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

console.log('Supabase client initialized successfully');

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
  const { data, error } = await supabase
    .from('message_feedback')
    .insert({
      message_id: feedback.message_id,
      is_positive: feedback.is_positive,
      feedback_text: feedback.feedback_text,
      message_content: feedback.message_content,
      message_metadata: feedback.message_metadata || {},
      formatting_analysis: feedback.formatting_analysis || [],
      user_id: (await supabase.auth.getUser()).data.user?.id || null
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving feedback:', error);
    throw error;
  }

  return data;
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
