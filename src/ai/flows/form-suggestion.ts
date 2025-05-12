'use server';

/**
 * @fileOverview Provides AI-powered suggestions for form fields, specializing in WhatsApp message formatting.
 *
 * - suggestFormFields - A function that provides WhatsApp-formatted suggestions for form fields based on context, message type, and initial content.
 * - SuggestFormFieldsInput - The input type for the suggestFormFields function.
 * - SuggestFormFieldsOutput - The return type for the suggestFormFields function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFormFieldsInputSchema = z.object({
  context: z.string().describe('The user-provided text to be WhatsAppified, or an idea/topic for message generation.'),
  messageType: z.enum(["marketing", "authentication", "utility", "service"]).describe('The selected type of WhatsApp message (e.g., marketing, authentication).'),
  field1: z.string().optional().describe('The initial content for the first part of the WhatsApp message or the first suggestion field.'),
  field2: z.string().optional().describe('The initial content for the second part of the WhatsApp message or the second suggestion field.'),
  field3: z.string().optional().describe('The initial content for the third part of the WhatsApp message or the third suggestion field.'),
});
export type SuggestFormFieldsInput = z.infer<typeof SuggestFormFieldsInputSchema>;

const SuggestFormFieldsOutputSchema = z.object({
  suggestion1: z.string().describe('AI-generated WhatsApp-formatted suggestion for the first field, based on user input, message type, and Field 1 content.'),
  suggestion2: z.string().describe('AI-generated WhatsApp-formatted suggestion for the second field, based on user input, message type, and Field 2 content.'),
  suggestion3: z.string().describe('AI-generated WhatsApp-formatted suggestion for the third field, based on user input, message type, and Field 3 content.'),
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
Your task is to take the user's input (which could be existing text to convert OR an idea for a new message), the selected message type, and any existing content in "Field 1", "Field 2", and "Field 3".
Then, transform these into three distinct, well-formatted WhatsApp message suggestions for "Suggestion 1", "Suggestion 2", and "Suggestion 3".

Message Type: {{{messageType}}}

User Input (Text to convert or Idea for message):
{{{context}}}

Current content for Field 1 (this might be empty or a draft; build upon it if relevant, otherwise generate based on User Input and Message Type):
{{{field1}}}

Current content for Field 2 (this might be empty or a draft; build upon it if relevant, otherwise generate based on User Input and Message Type):
{{{field2}}}

Current content for Field 3 (this might be empty or a draft; build upon it if relevant, otherwise generate based on User Input and Message Type):
{{{field3}}}

Prioritize converting the "User Input" if it appears to be existing text that needs WhatsApp formatting.
If "User Input" seems to be an idea or topic, generate new messages based on that idea and the "Message Type".
If a "Field X" (1, 2, or 3) already has content, refine and enhance that content for WhatsApp, always considering the overall "User Input" and "Message Type". If "Field X" is empty, generate a new message component for it based on the "User Input" and "Message Type".

Apply WhatsApp formatting best practices:
- Use *bold* for emphasis, headings, or key information (e.g., *Special Offer!*).
- Use _italics_ for sub-text, softer emphasis, or to highlight specific terms (e.g., _Limited time only_).
- Use ~strikethrough~ for discounts, old prices, or completed tasks (e.g., ~Was $99~ Now $49!).
- Use \`\`\`monospace\`\`\` for codes (like OTPs: \`\`\`123456\`\`\`), specific URLs, or technical details.
- Incorporate emojis appropriately to enhance engagement, convey emotion, and improve visual appeal. Ensure emojis are relevant to the message content and the '{{{messageType}}}' (e.g., 🚀 for launches, 🔒 for security, 🗓️ for reminders, ℹ️ for information).
- Keep messages concise, clear, and actionable, tailoring the tone and style to the specified '{{{messageType}}}'.
- Ensure each suggestion ("Suggestion 1", "Suggestion 2", "Suggestion 3") results in a complete, ready-to-send WhatsApp message or a significant, distinct part of one if they are clearly meant to be combined sequentially by the user.

Based on all the above, provide polished, WhatsApp-formatted suggestions for "Suggestion 1", "Suggestion 2", and "Suggestion 3".`,
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
