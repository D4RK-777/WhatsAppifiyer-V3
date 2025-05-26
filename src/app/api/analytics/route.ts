import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Temporarily return a simple response
    return NextResponse.json(
      { 
        success: true,
        message: 'Analytics endpoint is temporarily disabled',
        data: {
          feedbackOverTime: {},
          tagUsage: {},
          totalFeedback: 0,
          positiveFeedback: 0,
          negativeFeedback: 0
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in analytics endpoint:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal Server Error',
        message: 'An error occurred while processing your request'
      },
      { status: 500 }
    );
  }
}
