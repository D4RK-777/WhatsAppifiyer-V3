
'use server';

/**
 * @fileOverview Provides AI-powered suggestions for form fields, specializing in WhatsApp message formatting.
 *
 * - suggestFormFields - A function that provides WhatsApp-formatted suggestions for form fields based on context and initial content.
 * - SuggestFormFieldsInput - The input type for the suggestFormFields function.
 * - SuggestFormFieldsOutput - The return type for the suggestFormFields function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFormFieldsInputSchema = z.object({
  field1: z.string().optional().describe('The initial content for the first part of the WhatsApp message or the first suggestion.'),
  field2: z.string().optional().describe('The initial content for the second part of the WhatsApp message or the second suggestion.'),
  field3: z.string().optional().describe('The initial content for the third part of the WhatsApp message or the third suggestion.'),
  context: z.string().describe('The context or goal for the WhatsApp message (e.g., marketing campaign, OTP, appointment reminder).'),
});
export type SuggestFormFieldsInput = z.infer<typeof SuggestFormFieldsInputSchema>;

const SuggestFormFieldsOutputSchema = z.object({
  suggestion1: z.string().describe('AI-generated WhatsApp-formatted suggestion based on Field 1 and context.'),
  suggestion2: z.string().describe('AI-generated WhatsApp-formatted suggestion based on Field 2 and context.'),
  suggestion3: z.string().describe('AI-generated WhatsApp-formatted suggestion based on Field 3 and context.'),
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
Your task is to take the provided context and the current content of "Field 1", "Field 2", and "Field 3", and transform them into three distinct, well-formatted WhatsApp message suggestions.
Apply WhatsApp formatting best practices:
- Use *bold* for emphasis, headings, or key information.
- Use _italics_ for sub-text, softer emphasis, or to highlight terms.
- Use ~strikethrough~ for discounts, old prices, or completed tasks.
- Use \`\`\`monospace\`\`\` for codes (like OTPs), URLs (if short and specific), or technical details.
- Incorporate emojis appropriately to enhance engagement, convey emotion, and improve visual appeal. Ensure emojis are relevant to the message content.
- Keep messages concise, clear, and actionable.
- Ensure each field results in a complete, ready-to-send WhatsApp message or a significant, distinct part of one if they are clearly meant to be combined sequentially by the user.

Context for the message (e.g., marketing campaign, OTP, appointment reminder):
{{{context}}}

Current content for Field 1 (this might be empty or a draft):
{{{field1}}}

Current content for Field 2 (this might be empty or a draft):
{{{field2}}}

Current content for Field 3 (this might be empty or a draft):
{{{field3}}}

Based on the above, provide polished, WhatsApp-formatted suggestions for "Suggestion 1" (derived from Field 1), "Suggestion 2" (derived from Field 2), and "Suggestion 3" (derived from Field 3). If a field is empty, generate a relevant WhatsApp message based on the context. If a field has content, refine and enhance it for WhatsApp.`,
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
