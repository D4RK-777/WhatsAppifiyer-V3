/**
 * Generates a unique message ID if one isn't provided
 */
export const getMessageId = (id?: string): string => {
  return id || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Extracts formatting information from a message
 */
export const analyzeMessageFormatting = (text: string) => {
  const analysis: Array<{
    format_type: string;
    position_start: number;
    position_end: number;
    content: string;
    context_category?: string;
  }> = [];

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
  
  // Check for italic text (surrounded by _ or *)
  const italicRegex = /\*(.*?)\*|_(.*?)_/g;
  while ((match = italicRegex.exec(text)) !== null) {
    const content = match[1] || match[2];
    analysis.push({
      format_type: 'italic',
      position_start: match.index,
      position_end: match.index + match[0].length,
      content,
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
  
  // Check for line breaks
  const lineBreaks = text.split('\n');
  if (lineBreaks.length > 1) {
    let position = 0;
    for (let i = 0; i < lineBreaks.length - 1; i++) {
      position += lineBreaks[i].length;
      analysis.push({
        format_type: 'line_break',
        position_start: position,
        position_end: position + 1,
        content: '\n',
      });
      position += 1; // For the newline character
    }
  }
  
  return analysis;
};

/**
 * Cleans a message by removing formatting for analysis
 */
export const cleanMessageContent = (text: string): string => {
  // Remove markdown formatting
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')  // bold
    .replace(/\*(.*?)\*/g, '$1')       // italic
    .replace(/_(.*?)_/g, '$1')          // underline
    .replace(/~~(.*?)~~/g, '$1')         // strikethrough
    .replace(/`(.*?)`/g, '$1');          // code
};
