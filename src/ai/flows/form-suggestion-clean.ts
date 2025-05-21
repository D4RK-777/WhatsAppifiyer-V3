'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Stage 1: Intent Analysis Schemas
const CreativeSuggestionSchema = z.object({
  angle: z.string().describe("A specific creative angle or approach for the message."),
  rationale: z.string().describe("The reasoning behind why this angle would be effective.")
});

const IntentAnalysisOutputSchema = z.object({
  trueIntent: z.string().describe("The core goal the user wants to achieve with the message."),
  appropriateTone: z.string().describe("The recommended tone of voice for the message."),
  keyElements: z.array(z.string()).describe("Essential pieces of information or calls to action."),
  targetAudienceAnalysis: z.string().describe("Description of the target audience and what resonates with them."),
  contextualNuances: z.string().describe("Subtle factors or unstated assumptions that influence the message."),
  creativeSuggestions: z.array(CreativeSuggestionSchema).length(3)
});

export type IntentAnalysisOutput = z.infer<typeof IntentAnalysisOutputSchema>;

// Stage 2: Input and Output Schemas
const SuggestFormFieldsInputSchema = z.object({
  context: z.string().describe('The user input to generate WhatsApp messages from'),
  messageType: z.enum(["marketing", "authentication", "utility", "service"]),
  field1: z.string().optional(),
  field2: z.string().optional(),
  field3: z.string().optional(),
});

export type SuggestFormFieldsInput = z.infer<typeof SuggestFormFieldsInputSchema>;

const SuggestFormFieldsOutputSchema = z.object({
  suggestion1: z.string(),
  suggestion2: z.string(),
  suggestion3: z.string(),
  analysis: IntentAnalysisOutputSchema.optional()
});

export type SuggestFormFieldsOutput = z.infer<typeof SuggestFormFieldsOutputSchema>;

// Stage 1: Intent Analysis Function
async function analyzeUserInput(input: SuggestFormFieldsInput): Promise<IntentAnalysisOutput> {
  const prompt = `
    As a master communication strategist, analyze this WhatsApp message request:

    User Input: "${input.context}"
    Message Type: ${input.messageType}

    Provide a JSON object with:
    1. True Intent: Core goal to achieve
    2. Appropriate Tone: Best tone of voice
    3. Key Elements: Must-include information
    4. Target Audience: Who we're addressing
    5. Contextual Nuances: Important subtle factors
    6. Creative Suggestions: Three distinct approaches

    Format:
    {
      "trueIntent": "string",
      "appropriateTone": "string",
      "keyElements": ["string"],
      "targetAudienceAnalysis": "string",
      "contextualNuances": "string",
      "creativeSuggestions": [
        { "angle": "string", "rationale": "string" },
        { "angle": "string", "rationale": "string" },
        { "angle": "string", "rationale": "string" }
      ]
    }
  `;

  try {
    const response = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: { text: prompt },
      config: {
        temperature: 0.5,
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No analysis response received");
    }

    const parsedAnalysis = JSON.parse(responseText);
    return IntentAnalysisOutputSchema.parse(parsedAnalysis);

  } catch (error) {
    console.error('Error in analyzeUserInput:', error);
    return {
      trueIntent: "Error analyzing intent",
      appropriateTone: "neutral",
      keyElements: ["Error: Could not analyze key elements"],
      targetAudienceAnalysis: "Error analyzing audience",
      contextualNuances: "Error analyzing nuances",
      creativeSuggestions: [
        { angle: "Direct Approach", rationale: "Fallback due to error" },
        { angle: "Simple Message", rationale: "Fallback due to error" },
        { angle: "Basic Information", rationale: "Fallback due to error" }
      ]
    };
  }
}

// Stage 2: Message Generation Function
async function generateMessage(
  analysis: IntentAnalysisOutput,
  originalInput: SuggestFormFieldsInput,
  creativeSuggestion: { angle: string; rationale: string }
): Promise<string> {
  const prompt = `
    Write a WhatsApp marketing message with this context:
    - Intent: ${analysis.trueIntent}
    - Tone: ${analysis.trueIntent}
    - Key Points: ${analysis.keyElements.join(", ")}
    - Audience: ${analysis.targetAudienceAnalysis}
    - Angle: ${creativeSuggestion.angle}
    - Context: "${originalInput.context}"

    IMPORTANT: Use actual newlines (press Enter) for line breaks between paragraphs.
    Example formatting:
    *First line*\n\nSecond paragraph\n\n*Call to action!*

    Use *bold* for emphasis and important elements.
    Include emojis where appropriate.
    Keep paragraphs short and scannable.
    
    ONLY respond with the message content, no explanations.`;

  try {
    const response = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: { text: prompt },
      config: {
        temperature: 0.7,
        maxOutputTokens: 300,
      },
    });

    const messageText = response.text;
    return messageText || "*Error generating message*\nPlease try again.";
  } catch (error) {
    console.error('Error generating message:', error);
    return "*Error generating message*\nPlease try again.";
  }
}

// Main Function
export async function suggestFormFields(input: SuggestFormFieldsInput): Promise<SuggestFormFieldsOutput> {
  try {
    // Stage 1: Analyze the input
    const analysis = await analyzeUserInput(input);

    // Stage 2: Generate three messages based on the analysis
    const messages = await Promise.all(
      analysis.creativeSuggestions.map(suggestion =>
        generateMessage(analysis, input, suggestion)
      )
    );

    return {
      suggestion1: messages[0] || "*Error generating message*\nPlease try again.",
      suggestion2: messages[1] || "*Error generating message*\nPlease try again.",
      suggestion3: messages[2] || "*Error generating message*\nPlease try again.",
      analysis // Include the analysis in the output
    };

  } catch (error) {
    console.error('Error in suggestFormFields:', error);
    const errorMessage = "*Error generating message*\nPlease try again.";
    return {
      suggestion1: errorMessage,
      suggestion2: errorMessage,
      suggestion3: errorMessage
    };
  }
}
