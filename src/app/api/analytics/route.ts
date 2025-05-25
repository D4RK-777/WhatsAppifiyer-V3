import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Get feedback stats
    const { data: feedbackStats } = await supabase
      .from('message_feedback')
      .select('is_positive, created_at')
      .order('created_at', { ascending: true });

    // Get tag usage
    const { data: tagStats } = await supabase
      .from('message_feedback_tags')
      .select(`
        tag:feedback_tags(
          name,
          color
        )
      `);

    // Process data for charts
    const feedbackByDate = feedbackStats?.reduce((acc: Record<string, { positive: number; negative: number }>, item) => {
      const date = new Date(item.created_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { positive: 0, negative: 0 };
      }
      if (item.is_positive) {
        acc[date].positive += 1;
      } else {
        acc[date].negative += 1;
      }
      return acc;
    }, {});

    const tagCounts = tagStats?.reduce((acc: Record<string, number>, item: any) => {
      const tagName = item.tag?.name;
      if (tagName) {
        acc[tagName] = (acc[tagName] || 0) + 1;
      }
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        feedbackOverTime: feedbackByDate || {},
        tagUsage: tagCounts || {},
        totalFeedback: feedbackStats?.length || 0,
        positiveFeedback: feedbackStats?.filter((f: any) => f.is_positive).length || 0,
        negativeFeedback: feedbackStats?.filter((f: any) => !f.is_positive).length || 0,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
