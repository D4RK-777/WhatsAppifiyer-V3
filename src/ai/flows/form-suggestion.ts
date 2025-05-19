
'use server';

/**
 * @fileOverview Provides AI-powered suggestions for form fields, specializing in WhatsApp message formatting.
 *
 * - suggestFormFields - A function that provides three WhatsApp-formatted variations for a message based on context, message type, and initial content.
 * - SuggestFormFieldsInput - The input type for the suggestFormFields function.
 * - SuggestFormFieldsOutput - The return type for the suggestFormFields function, containing three variations of the message.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFormFieldsInputSchema = z.object({
  context: z.string().describe('The user-provided text to be WhatsAppified, or an idea/topic for message generation.'),
  messageType: z.enum(["marketing", "authentication", "utility", "service"]).describe('The selected type of WhatsApp message (e.g., marketing, authentication).'),
  field1: z.string().optional().describe('Optional: Initial content for the first part/draft of the WhatsApp message. If provided, the AI should consider this as a starting point for one of its variations.'),
  field2: z.string().optional().describe('Optional: Initial content for the second part/draft of the WhatsApp message. If provided, the AI should consider this as a starting point for one of its variations.'),
  field3: z.string().optional().describe('Optional: Initial content for the third part/draft of the WhatsApp message. If provided, the AI should consider this as a starting point for one of its variations.'),
});
export type SuggestFormFieldsInput = z.infer<typeof SuggestFormFieldsInputSchema>;

const SuggestFormFieldsOutputSchema = z.object({
  suggestion1: z.string().describe('AI-generated WhatsApp-formatted message: Variation 1, based on user input, message type, and any initial field content.'),
  suggestion2: z.string().describe('AI-generated WhatsApp-formatted message: Variation 2, based on user input, message type, and any initial field content. This should be a distinct alternative to Variation 1.'),
  suggestion3: z.string().describe('AI-generated WhatsApp-formatted message: Variation 3, based on user input, message type, and any initial field content. This should be a distinct alternative to Variations 1 and 2.'),
});
export type SuggestFormFieldsOutput = z.infer<typeof SuggestFormFieldsOutputSchema>;

export async function suggestFormFields(input: SuggestFormFieldsInput): Promise<SuggestFormFieldsOutput> {
  return suggestFormFieldsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestWhatsAppFormFieldsPrompt',
  input: {schema: SuggestFormFieldsInputSchema},
  output: {schema: SuggestFormFieldsOutputSchema},
  prompt: `You are a world-class marketing copywriter specializing in creating actual WhatsApp business messages. DO NOT DESCRIBE WHAT YOU WILL DO - JUST WRITE THE ACTUAL MESSAGES.

Your task is to take the user's input and create THREE DISTINCT WhatsApp messages based on it. If the user asks for a specific tone (like "cheeky"), ACTUALLY USE THAT TONE in your writing.

Message Type: {{{messageType}}}

User Input (Text to convert or Idea for message):
{{{context}}}

Optional initial content for Field 1:
{{{field1}}}

Optional initial content for Field 2:
{{{field2}}}

Optional initial content for Field 3:
{{{field3}}}

IMPORTANT RULES:
1. DO NOT write about how you'll create the message - JUST WRITE THE ACTUAL MESSAGES
2. If the user requests a specific tone (like "cheeky", "funny", "professional"), USE THAT EXACT TONE
3. For marketing messages about products, focus on benefits, features, and creating desire
4. Create the actual content the user wants, not a description of what you'll do

WHATSAPP FORMATTING RULES (EXTREMELY IMPORTANT):
- YOU MUST USE ALL FORMATTING TYPES IN EVERY MESSAGE:
  * *Bold* for headlines, product names, key benefits, and important points
  * _Italics_ for emphasis, testimonials, or subtle points
  * ~Strikethrough~ for discounts (e.g., ~$199~ now $99!)
  * \`\`\`Monospace\`\`\` for discount codes, store locations, or important details
- NEVER create a message without using ALL FOUR formatting types
- Use emojis strategically to enhance the message (not replace text)

WHATSAPP SPACING RULES (EXTREMELY IMPORTANT):
- ALWAYS use double line breaks (\\n\\n) between paragraphs - NEVER use single line breaks
- After greeting lines (e.g., "Hey there!"), ALWAYS add a double line break (\\n\\n)
- Between different sections or points, ALWAYS add a double line break (\\n\\n)
- Before a call-to-action, ALWAYS add a double line break (\\n\\n)
- NEVER put content too close together - proper spacing is CRITICAL

MESSAGE STRUCTURE REQUIREMENTS:
- Start with an attention-grabbing headline (in *bold*)
- Include a greeting with the recipient's name placeholder
- Present the main offer with proper formatting
- Use bullet points or numbered lists when appropriate
- Include at least one price point with ~strikethrough~ for original price
- End with a compelling call-to-action
- Include a discount code in \`\`\`monospace\`\`\`

EMOJI USAGE:
- Use 4-8 different emojis per message
- Place emojis at the start of important points
- Use emojis that match the product/service theme
- Don't cluster too many emojis together

For example, if asked for a "cheeky jewelry campaign", write an ACTUALLY CHEEKY message about jewelry with ALL formatting types, proper spacing, and appropriate emojis.

WRITE THREE COMPLETELY DIFFERENT MESSAGES THAT USE ALL FORMATTING TYPES, PROPER SPACING, AND MATCH THE REQUESTED STYLE AND TONE.`,
});

const suggestFormFieldsFlow = ai.defineFlow(
  {
    name: 'suggestWhatsAppFormFieldsFlow',
    inputSchema: SuggestFormFieldsInputSchema,
    outputSchema: SuggestFormFieldsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
