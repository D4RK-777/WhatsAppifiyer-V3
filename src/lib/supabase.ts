import { createClient } from '@supabase/supabase-js';

console.log('DEBUG: process.env.NEXT_PUBLIC_SUPABASE_URL at top of supabase.ts:', process.env.NEXT_PUBLIC_SUPABASE_URL);
import { Database } from '@/types/supabase';
import { MessageType } from '@/lib/constants';

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
let resolveSupabaseClient: (value: any) => void;
let rejectSupabaseClient: (reason?: any) => void;
export const supabase = new Promise<any>((resolve, reject) => {
  resolveSupabaseClient = resolve;
  rejectSupabaseClient = reject;
});

async function initSupabaseClient() {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.warn('⚠️ Supabase environment variables not found in process.env, attempting to fetch from API route.');
    try {
      const response = await fetch('/api/env');
      const data = await response.json();
      url = data.NEXT_PUBLIC_SUPABASE_URL;
      anonKey = data.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    } catch (error) {
      console.error('❌ Failed to fetch Supabase environment variables from API route:', error);
      rejectSupabaseClient(new Error('Failed to fetch Supabase environment variables from API route.'));
      return;
    }
  }

  if (url && anonKey) {
    try {
      const client = createClient<Database>(
        url,
        anonKey,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
          }
        }
      );
      console.log('✅ Supabase client initialized successfully');
      resolveSupabaseClient(client);
    } catch (error) {
      console.error('❌ Error initializing Supabase client:', error);
      rejectSupabaseClient(error);
    }
  } else {
    console.error('❌ Supabase client not initialized: Missing required environment variables after all attempts.');
    rejectSupabaseClient(new Error('Supabase client not initialized: Missing required environment variables.'));
  }
}

// Call the initialization function
initSupabaseClient();

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
      const client = await supabase;
      const { data: userData } = await client.auth.getUser();
      userId = userData.user?.id || null;
    } catch (authError) {
      console.log('No authenticated user, saving as anonymous feedback');
    }

    const client = await supabase;
    const { data, error } = await client
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
    if (error instanceof Error) {
      console.error('Failed to save feedback:', error.message);
    } else {
      console.error('Failed to save feedback:', error);
    }
    throw error;
  }
};

export const getMessageFeedback = async (messageId: string) => {
  const client = await supabase;
  const { data, error } = await client
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
      const client = await supabase;
      const { data: userData } = await client.auth.getUser();
      userId = userData.user?.id || null;
    } catch (authError) {
      console.log('No authenticated user, logging action anonymously');
    }

    const client = await supabase;
    const { data, error } = await client
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
    if (error instanceof Error) {
      console.error('Failed to log message action:', error.message);
    } else {
      console.error('Failed to log message action:', error);
    }
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

export const saveTemplate = async (template: {
  id: number;
  title: string;
  dataAiHint: string;
  messageType: MessageType;
  templateContent: {
    field1?: string;
    field2?: string;
    field3?: string;
  };
}) => {
  try {
    let userId = null;
    try {
      const client = await supabase;
      const { data: userData } = await client.auth.getUser();
      userId = userData.user?.id || null;
    } catch (authError) {
      console.log('No authenticated user, saving template anonymously');
    }

    const client = await supabase;
    const { data, error } = await client
      .from('templates') // Assuming a 'templates' table exists
      .insert({
        template_id: template.id,
        title: template.title,
        data_ai_hint: template.dataAiHint,
        message_type: template.messageType,
        field1: template.templateContent.field1,
        field2: template.templateContent.field2,
        field3: template.templateContent.field3,
        user_id: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving template:', error);
      throw error;
    }

    console.log('Template saved successfully:', data);
    return data;
  }
  catch (error) {
    if (error instanceof Error) {
      console.error('Failed to save template:', error.message);
    } else {
      console.error('Failed to save template:', error);
    }
    throw error;
  }
};

export const saveFormSubmission = async (formData: {
  yourTextOrIdea: string;
  messageType: MessageType | "";
  mediaType: string | "";
  tone: string | "";
  field1?: string;
  field2?: string;
  field3?: string;
}) => {
  try {
    let userId = null;
    let isAuthenticated = false;
    try {
      const client = await supabase;
      const { data: userData, error: authError } = await client.auth.getUser();
      if (authError) {
        console.error('Error getting user data:', authError);
      }
      userId = userData.user?.id || null;
      isAuthenticated = !!userData.user;
      console.log('Supabase Auth User Data:', userData);
      console.log('User ID for insert:', userId);
      console.log('Is Authenticated:', isAuthenticated);
    } catch (authError) {
      console.log('Error in auth.getUser(), saving form submission anonymously:', authError);
    }

    const client = await supabase;
    const { data, error } = await client
      .from('form_submissions') // Assuming a 'form_submissions' table exists
      .insert({
        user_id: userId,
        your_text_or_idea: formData.yourTextOrIdea,
        message_type: formData.messageType,
        media_type: formData.mediaType,
        tone: formData.tone,
        field1: formData.field1,
        field2: formData.field2,
        field3: formData.field3,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving form submission:', error.message || error.details || error);
      throw error;
    }

    console.log('Form submission saved successfully:', data);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to save form submission:', error.message);
    } else {
      console.error('Failed to save form submission:', error);
    }
    throw error;
  }
};
