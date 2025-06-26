import { supabase } from './supabase';

/**
 * Interface for formatting analysis data
 */
interface FormattingItem {
  format_type: string;
  position_start: number;
  position_end: number;
  content: string;
  context_category?: string;
}

/**
 * Interface for message analytics data
 */
interface MessageAnalyticsData {
  originalMessage: string;
  generatedMessage: string;
  messageType: string;
  mediaType: string;
  toneOfVoice: string;
  wasRegenerated?: boolean;
  formattingAnalysis?: FormattingItem[];
  action?: 'like' | 'dislike' | 'copy';
  fieldName?: string;
}

/**
 * Saves message analytics data to the whatsapp_message_metrics table
 * This function works in the background and doesn't block the UI
 */
export const saveMessageAnalytics = async (data: MessageAnalyticsData) => {
  // Log the analytics data before sending to Supabase
  console.log('Analytics Payload:', data);
  try {
    // Calculate metrics
    const originalLength = data.originalMessage.length;
    const generatedLength = data.generatedMessage.length;
    
    // Calculate formatting density if formatting analysis is provided
    let formattingAnalysis = null;
    if (data.formattingAnalysis && data.formattingAnalysis.length > 0) {
      // Group by format type and calculate density
      const formatTypes: Record<string, number> = {};
      let totalFormattedChars = 0;
      
      data.formattingAnalysis.forEach(format => {
        const formatLength = format.position_end - format.position_start;
        formatTypes[format.format_type] = (formatTypes[format.format_type] || 0) + formatLength;
        totalFormattedChars += formatLength;
      });
      
      // Create formatting density analysis
      formattingAnalysis = {
        format_types: formatTypes,
        total_formatted_chars: totalFormattedChars,
        formatting_density: totalFormattedChars / generatedLength,
        formats: data.formattingAnalysis
      };
    }
    
    // Send to Supabase in the background
    const client = await supabase;
    client
      .from('whatsapp_message_metrics')
      .insert({
        original_message: data.originalMessage,
        generated_message: data.generatedMessage,
        message_type: data.messageType,
        media_type: data.mediaType,
        tone_of_voice: data.toneOfVoice,
        original_length: originalLength,
        generated_length: generatedLength,
        was_regenerated: data.wasRegenerated || false,
        formatting_analysis: formattingAnalysis,
        action: data.action || null,
        field_name: data.fieldName || null
      })
      .then(({ error }: { error: any }) => {
        if (error) {
          // Log error but don't throw - this is background analytics
          console.log('Analytics data collection failed silently:', error);
        } else {
          console.log('Analytics data collected successfully');
        }
      })
      .catch((error: any) => {
        // Log error but don't throw - this is background analytics
        console.log('Analytics data collection error:', error);
      });
      
    // Return immediately - don't wait for the insert to complete
    return true;
  } catch (error: any) {
    // Log error but don't throw - this is background analytics
    console.log('Analytics preparation error:', error);
    return false;
  }
};

/**
 * Analyzes formatting in a WhatsApp message
 * Returns an array of formatting items with their positions and types
 */
export const analyzeMessageFormatting = (message: string): FormattingItem[] => {
  const formattingItems: FormattingItem[] = [];
  
  // Regular expressions for different formatting types
  const patterns = [
    { type: 'bold', regex: /\*(.*?)\*/g },
    { type: 'italic', regex: /_(.*?)_/g },
    { type: 'strikethrough', regex: /~(.*?)~/g },
    { type: 'code', regex: /```(.*?)```/g },
    { type: 'emoji', regex: /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu },
    { type: 'url', regex: /(https?:\/\/[^\s]+)/g },
    { type: 'mention', regex: /@(\w+)/g },
    { type: 'hashtag', regex: /#(\w+)/g },
  ];
  
  // Find all formatting instances
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.regex.exec(message)) !== null) {
      formattingItems.push({
        format_type: pattern.type,
        position_start: match.index,
        position_end: match.index + match[0].length,
        content: match[0]
      });
    }
  });
  
  return formattingItems;
};
