import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabase, saveFeedback } from '@/lib/supabase';

// Helper to handle errors
function handleError(error: any) {
  console.error('Supabase error:', error);
  return NextResponse.json(
    { 
      success: false, 
      error: error.message,
      details: error.details || null,
      hint: error.hint || null,
      code: error.code || null
    },
    { status: 500 }
  );
}

// Type for the feedback data
type FeedbackData = {
  message_id: string;
  is_positive: boolean;
  feedback_text?: string;
  message_content: string;
  message_metadata?: {
    message_type?: string;
    media_type?: string;
    tone?: string;
  };
  formatting_analysis?: Array<{
    format_type: string;
    position_start: number;
    position_end: number;
    content: string;
    context_category?: string;
  }>;
};

export async function GET() {
  try {
    // Test the connection by fetching the current user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // Test database access
    const { data: tables, error: tablesError } = await supabase
      .from('message_feedback')
      .select('*')
      .limit(5);

    if (sessionError || tablesError) {
      throw sessionError || tablesError;
    }

    return NextResponse.json({
      success: true,
      session: session ? 'Authenticated' : 'Not authenticated',
      feedbackCount: tables?.length || 0,
      environment: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set',
      },
    });

  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const feedbackData: FeedbackData = await request.json();

    // Validate feedbackData (basic example)
    if (!feedbackData.message_id || typeof feedbackData.is_positive !== 'boolean') {
      return NextResponse.json({ error: 'Invalid feedback data' }, { status: 400 });
    }

    // Get the session
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options });
            } catch (error) {
              // The `delete` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    // Save the feedback directly to bypass RLS for testing
    const { data, error } = await supabase
      .from('message_feedback')
      .insert({
        message_id: feedbackData.message_id,
        user_id: session?.user?.id || null, // Will be null for unauthenticated users
        is_positive: feedbackData.is_positive,
        feedback_text: feedbackData.feedback_text,
        message_content: feedbackData.message_content,
        message_metadata: feedbackData.message_metadata || {},
        formatting_analysis: feedbackData.formatting_analysis || []
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      message: 'Feedback saved successfully'
    });

  } catch (error) {
    console.error('Error in API route:', error);
    return handleError(error);
  }
}
