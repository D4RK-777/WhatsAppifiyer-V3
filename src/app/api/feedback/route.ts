import { NextResponse } from 'next/server';
import { saveFeedback } from '../../../lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.message_id || typeof body.is_positive === 'undefined') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save the feedback
    const result = await saveFeedback(body);
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    );
  }
}
