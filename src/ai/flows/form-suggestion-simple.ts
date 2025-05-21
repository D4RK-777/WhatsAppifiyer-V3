'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Simple input/output schemas
const SimpleInputSchema = z.object({
  context: z.string().describe('The user input to generate WhatsApp messages from'),
  messageType: z.enum(["marketing", "authentication", "utility", "service"]),
});

type SimpleInput = z.infer<typeof SimpleInputSchema>;

const SimpleOutputSchema = z.object({
  message: z.string(),
});

type SimpleOutput = z.infer<typeof SimpleOutputSchema>;

export async function generateSimpleMessage(input: SimpleInput): Promise<SimpleOutput> {
  const prompt = `
    You are a helpful assistant that writes clear, well-formatted WhatsApp messages.
    
    Write a message with these characteristics:
    - Context: ${input.context}
    - Type: ${input.messageType}
    
    IMPORTANT FORMATTING RULES:
    1. Use ONE blank line between paragraphs
    2. Keep paragraphs short (1-2 lines max)
    3. Use *bold* for emphasis
    4. Use _italics_ for subtle emphasis
    5. Use ~strikethrough~ when needed
    6. Use `code` for inline code
    
    Example:
    *Hello!* 👋
    
    Here's a simple message with _good_ formatting.
    
    *Key Points:*
    • First point
    • Second point
    
    Let me know if you have any questions!`;

  try {
    const response = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: { text: prompt },
      config: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    return {
      message: response.text || "*Error generating message*"
    };
  } catch (error) {
    console.error('Error generating message:', error);
    return {
      message: "*Error generating message*\n\nPlease try again."
    };
  }
}
