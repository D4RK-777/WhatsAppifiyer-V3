
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
  prompt: `You are an expert AI assistant specializing in crafting engaging and effective WhatsApp messages.
Your task is to take the user's input (which could be existing text to convert OR an idea for a new message), the selected message type, and any existing content in "Field 1", "Field 2", or "Field 3".
Then, generate THREE DISTINCT VARIATIONS of a WhatsApp message based on this information. These variations should be provided for "Suggestion 1", "Suggestion 2", and "Suggestion 3". Each suggestion should be a complete, standalone message.

Message Type: {{{messageType}}}

User Input (Text to convert or Idea for message):
{{{context}}}

Optional initial content for Field 1 (consider as a draft or starting point if provided; otherwise, generate fresh):
{{{field1}}}

Optional initial content for Field 2 (consider as a draft or starting point if provided; otherwise, generate fresh):
{{{field2}}}

Optional initial content for Field 3 (consider as a draft or starting point if provided; otherwise, generate fresh):
{{{field3}}}

The core goal is to produce three different, high-quality WhatsApp message variations for the user to choose from.
- If "User Input" is existing text, transform it into three compelling WhatsApp versions.
- If "User Input" is an idea, generate three distinct messages based on that idea and the "Message Type".
- If "Field 1", "Field 2", or "Field 3" have content, use that as inspiration or a starting point for one or more variations, but ensure all three final suggestions are complete, refined, and WhatsApp-formatted. If a field is empty, generate a variation based on the "User Input" and "Message Type".

Apply WhatsApp formatting best practices to ALL THREE suggestions:
- Use *bold* for emphasis, headings, or key information (e.g., *Special Offer!*).
- Use _italics_ for sub-text, softer emphasis, or to highlight specific terms (e.g., _Limited time only_).
- Use ~strikethrough~ for discounts, old prices, or completed tasks (e.g., ~Was $99~ Now $49!).
- Use \`\`\`monospace\`\`\` for codes (like OTPs: \`\`\`123456\`\`\`), specific URLs, or technical details.
- Incorporate emojis appropriately to enhance engagement, convey emotion, and improve visual appeal. Ensure emojis are relevant to the message content and the '{{{messageType}}}' (e.g., 🚀 for launches, 🔒 for security, 🗓️ for reminders, ℹ️ for information).
- Keep messages concise, clear, and actionable, tailoring the tone and style to the specified '{{{messageType}}}'.
- **IMPORTANT: If a message starts with a greeting like "Hi {{UserName}}," or "Hello {{Name}}," always insert two newline characters (\\n\\n) after the greeting line to create a blank line for better readability before the main message body.** For example:
  "Hi {{UserName}},\\n\\nThis is the rest of the message..."
- Ensure "Suggestion 1", "Suggestion 2", and "Suggestion 3" are distinct from each other in terms of phrasing, emphasis, or structure, while conveying the same core message based on the user's input.

Based on all the above, provide three polished, WhatsApp-formatted message variations for "Suggestion 1", "Suggestion 2", and "Suggestion 3".`,
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
