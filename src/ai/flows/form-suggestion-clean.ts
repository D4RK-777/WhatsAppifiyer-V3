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
    - Tone: ${analysis.appropriateTone}
    - Key Points: ${analysis.keyElements.join(", ")}
    - Audience: ${analysis.targetAudienceAnalysis}
    - Angle: ${creativeSuggestion.angle}
    - Context: "${originalInput.context}"

    CRITICAL INSTRUCTIONS - READ CAREFULLY:
    
    SPACING IS CRUCIAL - Your message MUST include all spacing exactly as shown below.
    The preview will NOT add any spacing - YOU must include ALL spacing in your response.
    
    FORMATTING RULES:
    
    1. PARAGRAPHS:
       - ALWAYS put TWO newlines after EVERY paragraph (press ENTER twice)
       - Example: "This is a paragraph.\n\nThis is another paragraph."
    
    2. HEADINGS:
       - Put TWO newlines before and after any heading
       - Format: *Heading Text*\n\n
    
    3. EMOJI LINES:
       - Put TWO newlines before and after any line that's just emojis
       - Example: "...end of paragraph.\n\n✨\n\nStart of next..."
    
    4. LISTS:
       - Put TWO newlines before the list starts
       - Use • for list items (with one newline between items)
       - Put TWO newlines after the list ends
    
    5. TEXT FORMATTING:
       - *bold* for emphasis
       - _italics_ for subtle emphasis
       - ~strikethrough~ when needed
    
    EXAMPLE OUTPUT - COPY THIS FORMATTING EXACTLY:
    
    *Welcome Message*\n\n
    Hi [Name], we're excited to have you!\n\n
    ✨\n\n
    Here's what you can expect from us:\n\n
    • Exclusive offers\n
    • Helpful tips\n
    • 24/7 support\n\n
    *Get Started Now*\n\n
    [Click here to begin]\n\n
    ---\n\n
    YOUR TURN: Write the message below with EXACTLY the same spacing and formatting as shown above.\n\n`;

  try {
    const response = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: { text: prompt },
      config: {
        temperature: 0.3,  // Lower temperature for more consistent output
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 500,  // Increased to ensure complete messages
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
