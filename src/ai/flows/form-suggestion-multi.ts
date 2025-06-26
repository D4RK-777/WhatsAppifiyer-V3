import { z } from 'zod';

// Input/output schemas
const MultiInputSchema = z.object({
  context: z.string().describe('The user input to generate WhatsApp messages from'),
  messageType: z.enum(["marketing", "authentication", "utility", "service"]),
  mediaType: z.enum(["standard", "image", "video", "pdf", "carousel", "catalog"]),
  tone: z.enum(["professional", "friendly", "empathetic", "cheeky", "sincere", "urgent"]),
  field1: z.string().optional(),
  field2: z.string().optional(),
  field3: z.string().optional(),
});

type MultiInput = z.infer<typeof MultiInputSchema>;

const MultiOutputSchema = z.object({
  suggestion1: z.string(),
  suggestion2: z.string(),
  suggestion3: z.string(),
});

type MultiOutput = z.infer<typeof MultiOutputSchema>;

// Model configurations
const MODEL_NAMES = {
  'together-llama': 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
  'together-deepseek': 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free',
  'google-gemini': 'gemini-1.5-flash'
};

// Media type specific instructions
const MEDIA_TYPE_INSTRUCTIONS = {
  standard: '',
  image: '',
  video: '',
  pdf: '',
  carousel: '',
  catalog: ''
};

// Helper function for tone instructions
function getToneInstructions(tone: string): string {
  const toneMap: Record<string, string> = {
    professional: 'Use formal language, complete sentences, and proper grammar. Avoid slang and casual expressions.',
    friendly: 'Use warm, approachable language. Contractions are okay. Keep it conversational but professional.',
    empathetic: 'Show understanding and care. Use supportive language and acknowledge the recipient\'s perspective.',
    cheeky: 'Use playful, slightly humorous language. Can include puns or light-hearted comments.',
    sincere: 'Be genuine and heartfelt. Use direct, honest language without being overly formal.',
    urgent: 'Be direct and action-oriented. Use clear calls-to-action and highlight time sensitivity.'
  };
  return toneMap[tone] || 'Use clear, professional language appropriate for business communication.';
}

// Prompts for different scenarios
const EXISTING_TEXT_PROMPT = (input: MultiInput) => {
  const mediaInstruction = MEDIA_TYPE_INSTRUCTIONS[input.mediaType] || '';
  const toneInstruction = getToneInstructions(input.tone);
  
  return [
    'You are creating a WhatsApp Business message with these specifications:',
    `MESSAGE PURPOSE: ${input.messageType.toUpperCase()}`,
    `MEDIA TYPE: ${input.mediaType.toUpperCase()}`,
    `TONE: ${input.tone.toUpperCase()}`,
    '',
    mediaInstruction,
    '',
    'FORMATTING GUIDELINES:',
    '- Use WhatsApp formatting (*bold*, _italic_, ~strikethrough~, ```code```)',
    '- Include relevant emojis (1-3 per message)',
    '- Use line breaks for better readability',
    '- Keep paragraphs short (1-3 sentences)',
    '- For lists, use • or - for bullet points',
    '',
    `TONE INSTRUCTIONS:\n- ${toneInstruction}`,
    '',
    `MESSAGE CONTEXT:\n"${input.context}"`,
    '',
    'Generate a professional, engaging message that follows these guidelines. Focus on clear communication and appropriate formatting for the specified media type.',
    '',
    'ONLY return the final formatted message - NO explanations, thinking, or notes.'
  ].join('\n');
};

const NEW_IDEA_PROMPT = (input: MultiInput) => {
  const mediaInstruction = MEDIA_TYPE_INSTRUCTIONS[input.mediaType] || '';
  const toneInstruction = getToneInstructions(input.tone);
  
  return [
    'Create a new WhatsApp Business message with these specifications:',
    `MESSAGE PURPOSE: ${input.messageType.toUpperCase()}`,
    `MEDIA TYPE: ${input.mediaType.toUpperCase()}`,
    `TONE: ${input.tone.toUpperCase()}`,
    '',
    mediaInstruction,
    '',
    'FORMATTING GUIDELINES:',
    '- Use WhatsApp formatting (*bold*, _italic_, ~strikethrough~, ```code```)',
    '- Include relevant emojis (1-3 per message)',
    '- Use line breaks for better readability',
    '- Keep paragraphs short (1-3 sentences)',
    '- For lists, use • or - for bullet points',
    '',
    `TONE INSTRUCTIONS:\n- ${toneInstruction}`,
    '',
    'Generate a professional, engaging message that follows these guidelines. Focus on clear communication and appropriate formatting for the specified media type.',
    '',
    'ONLY return the final formatted message - NO explanations, thinking, or notes.'
  ].join('\n');
};



// Helper function to determine which prompt to use
function getPrompt(input: MultiInput): string {
  // If the input contains a complete message, use the existing text prompt
  if (input.context && input.context.trim().length > 20) {
    return EXISTING_TEXT_PROMPT(input);
  }
  // Otherwise, use the new idea prompt
  return NEW_IDEA_PROMPT(input);
}

// Function to call Together AI API
async function callTogetherAI(input: MultiInput, model: string): Promise<string> {
  try {
    const prompt = getPrompt(input);
    const fieldToImprove = input.field1 || input.field2 || input.field3 || '';
    const content = fieldToImprove.trim() ? fieldToImprove : input.context;
    
    // No fallback messages - let the API call work as expected
    
    try {
      const response = await fetch('/api/together', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: prompt
            },
            {
              role: 'user',
              content: `Message Type: ${input.messageType}\n\n${content}`
            }
          ],
          model
        })
      });

      if (!response.ok) {
        console.error(`Together AI API error: ${await response.text()}`);
        throw new Error(`Together AI API error`);
      }

      const data = await response.json();
      // Clean up the response by removing <think> tags and their content
      return (data.content || 'Error generating message').replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    } catch (error: unknown) {
      console.error('Error calling Together AI:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Error calling Together AI: ${errorMessage}`)
    }
  } catch (error: any) {
    console.error('Error in callTogetherAI function:', error);
    throw new Error(`Error in callTogetherAI function: ${error.message || 'Unknown error'}`)
  }
}

// Function to call Google Gemini API
async function callGeminiAI(input: MultiInput): Promise<string> {
  try {
    const prompt = getPrompt(input);
    const fieldToImprove = input.field1 || input.field2 || input.field3 || '';
    const content = fieldToImprove.trim() ? fieldToImprove : input.context;
    
    try {
      // Use the Gemini API endpoint
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${prompt}\n\nMessage Type: ${input.messageType}\n\n${content}`
        })
      });

      if (!response.ok) {
        console.error(`Gemini API error: ${await response.text()}`);
        throw new Error('Gemini API error');
      }

      const data = await response.json();
      return data.content || 'Error generating message';
    } catch (error: any) {
      console.error('Error calling Gemini API:', error);
      throw new Error(`Error calling Gemini API: ${error.message || 'Unknown error'}`);
    }
  } catch (error: any) {
    console.error('Error in callGeminiAI function:', error);
    throw new Error(`Error in callGeminiAI function: ${error.message || 'Unknown error'}`);
  }
}

// Main function to generate all three variations
export async function generateMultiProviderSuggestions(input: MultiInput): Promise<MultiOutput> {
  try {
    // Call all three APIs concurrently for better performance
    const [suggestion1, suggestion2, suggestion3] = await Promise.all([
      callTogetherAI(input, MODEL_NAMES['together-llama']),
      callTogetherAI(input, MODEL_NAMES['together-deepseek']),
      callGeminiAI(input)
    ]);

    // Ensure proper WhatsApp formatting syntax in all suggestions
    const ensureCorrectWhatsAppSyntax = (text: string): string => {
      return text
        // Fix double asterisks to single (WhatsApp uses single * for bold)
        .replace(/\*\*([^*]+?)\*\*/g, '*$1*')
        // Fix bullet points to use proper WhatsApp syntax (hyphen with space)
        .replace(/^[•\*]\s+(.+)$/gm, '- $1')
        // Ensure numbered lists have proper spacing
        .replace(/^(\d+)\.(?!\s)(.+)$/gm, '$1. $2')
        // Fix double underscores to single (WhatsApp uses single _ for italic)
        .replace(/__([^_]+?)__/g, '_$1_');
    };

    return {
      suggestion1: ensureCorrectWhatsAppSyntax(suggestion1),
      suggestion2: ensureCorrectWhatsAppSyntax(suggestion2),
      suggestion3: ensureCorrectWhatsAppSyntax(suggestion3)
    };
  } catch (error: any) {
    console.error('Error generating suggestions:', error);
    throw new Error(`Failed to generate WhatsApp message suggestions: ${error.message || 'Unknown error'}`);
  }
}
