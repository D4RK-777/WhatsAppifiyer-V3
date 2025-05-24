'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { saveFeedback } from '@/lib/supabase';

type FeedbackButtonsProps = {
  messageId: string;
  messageContent: string;
  messageMetadata?: {
    messageType?: string;
    mediaType?: string;
    tone?: string;
  };
  onFeedback?: (isPositive: boolean) => void;
};

export function FeedbackButtons({
  messageId,
  messageContent,
  messageMetadata = {},
  onFeedback,
}: FeedbackButtonsProps) {
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFeedback = async (isPositive: boolean) => {
    setFeedback(isPositive ? 'like' : 'dislike');
    
    // If it's a like, submit immediately
    if (isPositive) {
      await submitFeedback(isPositive);
    }
  };

  const submitFeedback = async (isPositive: boolean) => {
    if (isSubmitting || isSubmitted) return;
    
    setIsSubmitting(true);
    
    try {
      // Simple formatting analysis (can be enhanced)
      const formattingAnalysis = analyzeFormatting(messageContent);
      
      await saveFeedback({
        message_id: messageId,
        is_positive: isPositive,
        feedback_text: isPositive ? undefined : feedbackText,
        message_content: messageContent,
        message_metadata: {
          message_type: messageMetadata.messageType,
          media_type: messageMetadata.mediaType,
          tone: messageMetadata.tone,
        },
        formatting_analysis: formattingAnalysis,
      });
      
      setIsSubmitted(true);
      onFeedback?.(isPositive);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      // Reset on error
      setFeedback(null);
      setFeedbackText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simple formatting analysis function
  const analyzeFormatting = (text: string) => {
    // This is a basic implementation - can be enhanced
    const analysis = [];
    
    // Check for bold text (surrounded by * or **)
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    while ((match = boldRegex.exec(text)) !== null) {
      analysis.push({
        format_type: 'bold',
        position_start: match.index,
        position_end: match.index + match[0].length,
        content: match[1],
      });
    }
    
    // Check for emojis
    const emojiRegex = /[\p{Emoji}]/gu;
    while ((match = emojiRegex.exec(text)) !== null) {
      analysis.push({
        format_type: 'emoji',
        position_start: match.index,
        position_end: match.index + match[0].length,
        content: match[0],
      });
    }
    
    return analysis;
  };

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center space-x-2">
        <Button
          variant={feedback === 'like' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFeedback(true)}
          disabled={isSubmitting || isSubmitted}
        >
          <ThumbsUp className="h-4 w-4 mr-1" />
          Like
        </Button>
        <Button
          variant={feedback === 'dislike' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFeedback(false)}
          disabled={isSubmitting || isSubmitted}
        >
          <ThumbsDown className="h-4 w-4 mr-1" />
          Dislike
        </Button>
      </div>
      
      {feedback === 'dislike' && !isSubmitted && (
        <div className="space-y-2">
          <Textarea
            placeholder="What could be improved?"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="mt-2"
          />
          <Button
            onClick={() => submitFeedback(false)}
            disabled={isSubmitting || !feedbackText.trim()}
            size="sm"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      )}
      
      {isSubmitted && (
        <p className="text-sm text-green-600">
          Thank you for your feedback!
        </p>
      )}
    </div>
  );
}
