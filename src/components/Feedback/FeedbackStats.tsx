'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type FeedbackStats = {
  total: number;
  positive: number;
  negative: number;
  lastFeedbackAt: string | null;
};

export function FeedbackStats({ messageId }: { messageId: string }) {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('message_feedback')
          .select('is_positive, created_at')
          .eq('message_id', messageId);

        if (error) throw error;

        const positive = data.filter(fb => fb.is_positive).length;
        const negative = data.filter(fb => !fb.is_positive).length;
        const lastFeedback = data.length > 0 
          ? new Date(Math.max(...data.map(fb => new Date(fb.created_at).getTime()))).toLocaleString()
          : null;

        setStats({
          total: data.length,
          positive,
          negative,
          lastFeedbackAt: lastFeedback
        });
      } catch (err) {
        console.error('Error fetching feedback stats:', err);
        setError('Failed to load feedback statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [messageId]);

  if (loading) return <div className="text-sm text-gray-500">Loading feedback...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  if (!stats || stats.total === 0) return null;

  return (
    <div className="mt-2 text-sm text-gray-500">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <span className="text-green-500 mr-1">✓</span>
          <span>{stats.positive} likes</span>
        </div>
        <div className="flex items-center">
          <span className="text-red-500 mr-1">✗</span>
          <span>{stats.negative} dislikes</span>
        </div>
        {stats.lastFeedbackAt && (
          <div className="text-xs text-gray-400">
            Last feedback: {new Date(stats.lastFeedbackAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}
