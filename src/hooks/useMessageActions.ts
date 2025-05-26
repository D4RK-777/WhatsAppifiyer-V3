import { useCallback } from 'react';
import { logLike, logDislike, logCopy } from '@/lib/supabase';

interface UseMessageActionsProps {
  messageId: string;
  messageContent: string;
  onSuccess?: (action: 'like' | 'dislike' | 'copy') => void;
  onError?: (error: Error, action: 'like' | 'dislike' | 'copy') => void;
}

export const useMessageActions = ({
  messageId,
  messageContent,
  onSuccess,
  onError
}: UseMessageActionsProps) => {
  const handleLike = useCallback(async (metadata = {}) => {
    try {
      await logLike(messageId, messageContent, metadata);
      onSuccess?.('like');
    } catch (error) {
      console.error('Failed to log like:', error);
      onError?.(error as Error, 'like');
    }
  }, [messageId, messageContent, onSuccess, onError]);

  const handleDislike = useCallback(async (metadata = {}) => {
    try {
      await logDislike(messageId, messageContent, metadata);
      onSuccess?.('dislike');
    } catch (error) {
      console.error('Failed to log dislike:', error);
      onError?.(error as Error, 'dislike');
    }
  }, [messageId, messageContent, onSuccess, onError]);

  const handleCopy = useCallback(async (metadata = {}) => {
    try {
      await logCopy(messageId, messageContent, metadata);
      onSuccess?.('copy');
    } catch (error) {
      console.error('Failed to log copy action:', error);
      onError?.(error as Error, 'copy');
    }
  }, [messageId, messageContent, onSuccess, onError]);

  return {
    handleLike,
    handleDislike,
    handleCopy
  };
};

export default useMessageActions;
