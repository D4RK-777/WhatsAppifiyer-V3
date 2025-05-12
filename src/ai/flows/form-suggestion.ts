'use server';

/**
 * @fileOverview Provides AI-powered suggestions for form fields.
 *
 * - suggestFormFields - A function that provides suggestions for form fields based on context.
 * - SuggestFormFieldsInput - The input type for the suggestFormFields function.
 * - SuggestFormFieldsOutput - The return type for the suggestFormFields function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFormFieldsInputSchema = z.object({
  field1: z.string().describe('The content of the first form field.'),
  field2: z.string().describe('The content of the second form field.'),
  field3: z.string().describe('The content of the third form field.'),
  context: z.string().describe('Additional context to improve suggestions.'),
});
export type SuggestFormFieldsInput = z.infer<typeof SuggestFormFieldsInputSchema>;

const SuggestFormFieldsOutputSchema = z.object({
  suggestion1: z.string().describe('Suggestion for the first form field.'),
  suggestion2: z.string().describe('Suggestion for the second form field.'),
  suggestion3: z.string().describe('Suggestion for the third form field.'),
});
export type SuggestFormFieldsOutput = z.infer<typeof SuggestFormFieldsOutputSchema>;

export async function suggestFormFields(input: SuggestFormFieldsInput): Promise<SuggestFormFieldsOutput> {
  return suggestFormFieldsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFormFieldsPrompt',
  input: {schema: SuggestFormFieldsInputSchema},
  output: {schema: SuggestFormFieldsOutputSchema},
  prompt: `You are an AI assistant that provides suggestions for form fields based on the given context and the current content of the fields.

Context: {{{context}}}

Field 1: {{{field1}}}
Field 2: {{{field2}}}
Field 3: {{{field3}}}

Provide suggestions for each field that are relevant to the context and improve the quality of the form completion.`,
});

const suggestFormFieldsFlow = ai.defineFlow(
  {
    name: 'suggestFormFieldsFlow',
    inputSchema: SuggestFormFieldsInputSchema,
    outputSchema: SuggestFormFieldsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
