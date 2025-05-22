import { z } from 'zod';

// Input/output schemas
const MultiInputSchema = z.object({
  context: z.string().describe('The user input to generate WhatsApp messages from'),
  messageType: z.enum(["marketing", "authentication", "utility", "service"]),
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

// Prompts for different scenarios
const EXISTING_TEXT_PROMPT = `
Please use WhatsApp formatting, syntax and markdown and emojis. Please ensure you use a variety of formatting for B2C messages. Ensure you space and use lines and paragraphs, headings etc. appropriately. Use WhatsApp formatting, syntax and markdown and emojis. 

Ensure you use a variety of formatting for B2C messages. Space and use line breaks appropriately to look true to life. 

Keep the message similar to what it is now with slight variation to make it more appealing. Always in English.

ONLY return the final formatted message - NO explanations, thinking, or notes.
`;

const NEW_IDEA_PROMPT = `
Please use WhatsApp formatting, syntax and markdown and emojis. Please ensure you use a variety of formatting for B2C messages. Ensure you space and use lines and paragraphs, headings etc. appropriately. Use WhatsApp formatting, syntax and markdown and emojis. 

Ensure you use a variety of formatting for B2C messages. Space and use line breaks appropriately to look true to life. 

Keep the message similar to what it is now with slight variation to make it more appealing. Always in English.

ONLY return the final formatted message - NO explanations, thinking, or notes.
`;

// Helper function to determine which prompt to use
function getPrompt(input: MultiInput): string {
  // If any field has content, we're improving existing text
  if (input.field1?.trim() || input.field2?.trim() || input.field3?.trim()) {
    return EXISTING_TEXT_PROMPT;
  }
  // Otherwise, we're creating from a new idea
  return NEW_IDEA_PROMPT;
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
