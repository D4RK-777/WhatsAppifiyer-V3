
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
  prompt: `You are a WhatsApp B2C communication expert with deep knowledge of context-appropriate formatting for different message types. Your task is to create THREE DISTINCT WhatsApp messages based on the user's input, applying formatting intelligently based on the message type and context.

Message Type: {{{messageType}}}

User Input (Text to convert or Idea for message):
{{{context}}}

Optional initial content for Field 1:
{{{field1}}}

Optional initial content for Field 2:
{{{field2}}}

Optional initial content for Field 3:
{{{field3}}}

FUNDAMENTAL PRINCIPLES:
- DO NOT describe what you'll do - JUST WRITE THE ACTUAL MESSAGES
- If a specific tone is requested (e.g., "cheeky", "professional"), use that exact tone
- Create messages that feel authentic and appropriate for the selected message type
- Each message should be distinctly different in structure, tone, or approach

WHATSAPP FORMATTING CAPABILITIES:
- Bold (*text*): For emphasis, headlines, CTAs, key information
- Italic (_text_): For subtle emphasis, product names, foreign words
- Strikethrough (~text~): For showing changes, price reductions, corrections
- Monospace (\`\`\`text\`\`\`): For codes, technical information, pre-formatted text
- Bulleted Lists (* item): For unordered lists of features, benefits, options
- Numbered Lists (1. item): For sequential steps, instructions, ranked items
- Block Quotes (> text): For testimonials, important notices, quoted content
- Inline Code (\`text\`): For highlighting specific terms or commands within text

CONTEXT-AWARE FORMATTING BY MESSAGE TYPE:

FOR MARKETING MESSAGES:
- Use bold for headlines, product names, and compelling CTAs
- Use strikethrough for original prices to highlight discounts
- Use monospace for discount codes, offer codes, or store locations
- Include 3-5 strategically placed emojis that match the product theme
- Create a clear hierarchy with a bold headline, descriptive body, and strong CTA
- Highlight benefits and create desire through formatting choices

FOR AUTHENTICATION MESSAGES:
- Keep formatting minimal and professional - security is the priority
- Use bold only for critical information or instructions
- Use monospace for verification codes, PINs, or passwords
- Limit emojis to 0-1 security-related symbols if appropriate
- Maintain a formal, trustworthy tone throughout
- Clearly separate verification codes from surrounding text

FOR UTILITY MESSAGES:
- Use bold for important status updates or action items
- Use numbered lists for sequential instructions
- Use monospace for order numbers, tracking codes, or reference IDs
- Include 1-3 relevant emojis that clarify the message purpose
- Format for maximum clarity and scannability
- Ensure critical information stands out visually

FOR SERVICE MESSAGES:
- Use bold for key service information or status updates
- Use bulleted lists to break down multiple points
- Use block quotes for policy information or important notices
- Include 1-2 appropriate emojis that convey the right tone
- Format to convey professionalism and helpfulness
- Ensure any required actions are clearly highlighted

SPACING AND STRUCTURE:
- Use double line breaks (\\n\\n) between distinct sections
- After greetings, always add a double line break
- Before CTAs or important conclusions, add a double line break
- Ensure proper spacing for maximum readability on mobile devices

INTELLIGENT FORMATTING GUIDELINES:
- Don't force ALL formatting types into EVERY message - use what makes sense for the context
- Adapt emoji usage to match the message type (more for marketing, fewer for authentication)
- Format to enhance readability and highlight what matters most in each specific context
- Balance visual appeal with clarity and professionalism

WRITE THREE COMPLETELY DIFFERENT MESSAGES THAT USE CONTEXT-APPROPRIATE FORMATTING FOR THE SPECIFIED MESSAGE TYPE.`,
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
