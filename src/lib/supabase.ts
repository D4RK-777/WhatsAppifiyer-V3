import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Debug environment variables
console.log('Environment variables available:', Object.keys(process.env).filter(key => key.includes('NEXT_PUBLIC_') || key.includes('SUPABASE_')));
console.log('NEXT_PUBLIC_SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl || 'NOT SET');
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'NOT SET');
  throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set');
}

const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

console.log('Supabase client initialized successfully');

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
