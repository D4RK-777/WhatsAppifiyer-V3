'use server';

/**
 * @fileOverview Provides AI-powered suggestions for form fields, specializing in WhatsApp message formatting.
 * 
 * This implementation uses a four-stage AI approach:
 * 1. Intent & Context Analyzer: Deeply analyzes user intent, tone, and context
 * 2. Creative Copywriter: Crafts compelling, emotionally resonant message content
 * 3. Message Structure Planner: Plans the structure and key elements to highlight
 * 4. WhatsApp Formatting Specialist: Applies precise WhatsApp-specific formatting
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

// Intermediate schema for the intent analysis stage (Stage 1)
const IntentAnalysisSchema = z.object({
  coreIntent: z.string().describe('The true underlying intent/purpose of the message, beyond just the literal words.'),
  toneOfVoice: z.string().describe('The specific tone that would be most effective (e.g., friendly, professional, urgent, humorous, etc.).'),
  keyElements: z.array(z.string()).describe('The critical information or elements that must be included in the message.'),
  targetAudience: z.string().describe('Who the message is targeting and what would resonate with them.'),
  contextualNuance: z.string().describe('Any subtle contextual factors that should influence the message creation.'),
  creativeSuggestions: z.array(z.string()).describe('Creative angles or approaches that could make the message more effective.'),
  emotionalHooks: z.array(z.string()).describe('Emotional triggers that would resonate with the target audience.'),
  psychologicalPrinciples: z.array(z.string()).describe('Psychological principles that could be leveraged (e.g., scarcity, social proof).')
});
type IntentAnalysis = z.infer<typeof IntentAnalysisSchema>;

// Intermediate schema for the creative copywriting stage (Stage 2)
const CreativeCopySchema = z.object({
  variation1: z.object({
    headline: z.string().describe('Attention-grabbing headline or opening line for the first message variation.'),
    body: z.string().describe('Main content of the first message variation.'),
    cta: z.string().describe('Call to action for the first message variation.'),
    tone: z.string().describe('The specific tone used in this variation.')
  }),
  variation2: z.object({
    headline: z.string().describe('Attention-grabbing headline or opening line for the second message variation.'),
    body: z.string().describe('Main content of the second message variation.'),
    cta: z.string().describe('Call to action for the second message variation.'),
    tone: z.string().describe('The specific tone used in this variation.')
  }),
  variation3: z.object({
    headline: z.string().describe('Attention-grabbing headline or opening line for the third message variation.'),
    body: z.string().describe('Main content of the third message variation.'),
    cta: z.string().describe('Call to action for the third message variation.'),
    tone: z.string().describe('The specific tone used in this variation.')
  }),
  suggestedEmojis: z.array(z.string()).describe('Suggested emojis that would enhance the message.'),
  keyHighlights: z.array(z.string()).describe('Key points that should be highlighted in the formatting.')
});
type CreativeCopy = z.infer<typeof CreativeCopySchema>;

// Intermediate schema for the message structure planning stage (Stage 3)
const MessageStructureSchema = z.object({
  variation1: z.object({
    structuredContent: z.string().describe('The structured content for the first message variation, with clear sections and elements.'),
    formattingPlan: z.object({
      boldElements: z.array(z.string()).describe('Specific text elements that should be bold.'),
      italicElements: z.array(z.string()).describe('Specific text elements that should be italic.'),
      strikethroughElements: z.array(z.string()).describe('Specific text elements that should have strikethrough.'),
      monospaceElements: z.array(z.string()).describe('Specific text elements that should be in monospace.'),
      bulletedLists: z.array(z.object({
        intro: z.string().optional().describe('Introduction text before the list.'),
        items: z.array(z.string()).describe('Items in the bulleted list.')
      })).describe('Bulleted lists to include in the message.'),
      numberedLists: z.array(z.object({
        intro: z.string().optional().describe('Introduction text before the list.'),
        items: z.array(z.string()).describe('Items in the numbered list.')
      })).describe('Numbered lists to include in the message.'),
      emojis: z.array(z.object({
        emoji: z.string().describe('The emoji to use.'),
        position: z.string().describe('Where to place this emoji (e.g., "after headline", "before CTA").')
      })).describe('Emojis to include and their positions.'),
      spacing: z.array(z.object({
        location: z.string().describe('Where to add spacing (e.g., "after greeting", "before CTA").'),
        type: z.enum(['single', 'double']).describe('Type of line break to add.')
      })).describe('Spacing to add for better readability.')
    })
  }),
  variation2: z.object({
    structuredContent: z.string().describe('The structured content for the second message variation, with clear sections and elements.'),
    formattingPlan: z.object({
      boldElements: z.array(z.string()).describe('Specific text elements that should be bold.'),
      italicElements: z.array(z.string()).describe('Specific text elements that should be italic.'),
      strikethroughElements: z.array(z.string()).describe('Specific text elements that should have strikethrough.'),
      monospaceElements: z.array(z.string()).describe('Specific text elements that should be in monospace.'),
      bulletedLists: z.array(z.object({
        intro: z.string().optional().describe('Introduction text before the list.'),
        items: z.array(z.string()).describe('Items in the bulleted list.')
      })).describe('Bulleted lists to include in the message.'),
      numberedLists: z.array(z.object({
        intro: z.string().optional().describe('Introduction text before the list.'),
        items: z.array(z.string()).describe('Items in the numbered list.')
      })).describe('Numbered lists to include in the message.'),
      emojis: z.array(z.object({
        emoji: z.string().describe('The emoji to use.'),
        position: z.string().describe('Where to place this emoji (e.g., "after headline", "before CTA").')
      })).describe('Emojis to include and their positions.'),
      spacing: z.array(z.object({
        location: z.string().describe('Where to add spacing (e.g., "after greeting", "before CTA").'),
        type: z.enum(['single', 'double']).describe('Type of line break to add.')
      })).describe('Spacing to add for better readability.')
    })
  }),
  variation3: z.object({
    structuredContent: z.string().describe('The structured content for the third message variation, with clear sections and elements.'),
    formattingPlan: z.object({
      boldElements: z.array(z.string()).describe('Specific text elements that should be bold.'),
      italicElements: z.array(z.string()).describe('Specific text elements that should be italic.'),
      strikethroughElements: z.array(z.string()).describe('Specific text elements that should have strikethrough.'),
      monospaceElements: z.array(z.string()).describe('Specific text elements that should be in monospace.'),
      bulletedLists: z.array(z.object({
        intro: z.string().optional().describe('Introduction text before the list.'),
        items: z.array(z.string()).describe('Items in the bulleted list.')
      })).describe('Bulleted lists to include in the message.'),
      numberedLists: z.array(z.object({
        intro: z.string().optional().describe('Introduction text before the list.'),
        items: z.array(z.string()).describe('Items in the numbered list.')
      })).describe('Numbered lists to include in the message.'),
      emojis: z.array(z.object({
        emoji: z.string().describe('The emoji to use.'),
        position: z.string().describe('Where to place this emoji (e.g., "after headline", "before CTA").')
      })).describe('Emojis to include and their positions.'),
      spacing: z.array(z.object({
        location: z.string().describe('Where to add spacing (e.g., "after greeting", "before CTA").'),
        type: z.enum(['single', 'double']).describe('Type of line break to add.')
      })).describe('Spacing to add for better readability.')
    })
  })
});
type MessageStructure = z.infer<typeof MessageStructureSchema>;

export async function suggestFormFields(input: SuggestFormFieldsInput): Promise<SuggestFormFieldsOutput> {
  return suggestFormFieldsFlow(input);
}

// STAGE 1: Intent & Context Analyzer Prompt
const intentAnalysisPrompt = ai.definePrompt({
  name: 'intentAnalysisPrompt',
  input: {schema: SuggestFormFieldsInputSchema},
  output: {schema: IntentAnalysisSchema},
  prompt: `You are an expert in communication psychology, consumer behavior, and marketing intent analysis. Your ONLY task is to deeply analyze the user's input to extract the true intent, appropriate tone, and contextual nuances needed to create highly effective WhatsApp messages.

Message Type: {{{messageType}}}

User Input (Text to convert or Idea for message):
{{{context}}}

Optional initial content for Field 1:
{{{field1}}}

Optional initial content for Field 2:
{{{field2}}}

Optional initial content for Field 3:
{{{field3}}}

Your job is to look beyond the literal words and understand:

1. What is the true underlying intent/purpose behind this message?
2. What specific tone of voice would be most effective for this message type and context?
3. What are the critical elements that must be included in the message?
4. Who is the target audience and what would resonate with them?
5. What subtle contextual factors should influence the message creation?
6. What creative angles or approaches could make this message particularly effective?
7. What emotional hooks would resonate with the target audience?
8. What psychological principles could be leveraged (e.g., scarcity, social proof, etc.)?

Provide a deep, insightful analysis that will guide the message creation process. DO NOT create the actual messages - focus entirely on understanding and analyzing the intent, tone, and context. Your analysis will be passed to a creative copywriter who will craft the actual message content.`
});

// STAGE 2: Creative Copywriter Prompt
const creativeCopywriterPrompt = ai.definePrompt({
  name: 'creativeCopywriterPrompt',
  input: { schema: z.object({
    originalInput: SuggestFormFieldsInputSchema,
    intentAnalysis: IntentAnalysisSchema
  })},
  output: { schema: CreativeCopySchema },
  prompt: `You are a world-class creative copywriter specializing in WhatsApp business messaging. Your task is to craft three distinct, compelling message variations based on the user's input and the intent analysis provided.

## MESSAGE TYPE
{{{originalInput.messageType}}}

## USER INPUT
{{{originalInput.context}}}

## OPTIONAL INITIAL CONTENT
Field 1: {{{originalInput.field1}}}
Field 2: {{{originalInput.field2}}}
Field 3: {{{originalInput.field3}}}

## INTENT ANALYSIS
Core Intent: {{{intentAnalysis.coreIntent}}}
Tone of Voice: {{{intentAnalysis.toneOfVoice}}}
Key Elements: {{{intentAnalysis.keyElements}}}
Target Audience: {{{intentAnalysis.targetAudience}}}
Contextual Nuance: {{{intentAnalysis.contextualNuance}}}
Creative Suggestions: {{{intentAnalysis.creativeSuggestions}}}
Emotional Hooks: {{{intentAnalysis.emotionalHooks}}}
Psychological Principles: {{{intentAnalysis.psychologicalPrinciples}}}

Your job is to create three DISTINCT variations of message content that:
1. Perfectly align with the message type ({{{originalInput.messageType}}})
2. Incorporate the core intent and key elements identified
3. Use the appropriate tone of voice
4. Leverage the emotional hooks and psychological principles identified
5. Are tailored to the target audience
6. Are concise and effective for WhatsApp (mobile-first, scannable)
7. Have a clear structure with headline, body content, and call-to-action

DO NOT worry about the exact WhatsApp formatting yet - focus on creating compelling content that will be formatted in the next stage. Each variation should take a different approach to the same core message.

For each variation, create:
- A strong, attention-grabbing headline
- Concise, compelling body content
- An effective call-to-action
- A description of the tone used

Also suggest:
- Appropriate emojis that would enhance the message
- Key points that should be highlighted in the formatting

Remember that WhatsApp messages are viewed primarily on mobile devices, so brevity and clarity are essential.`
});

// STAGE 3: Message Structure Planner Prompt
const messageStructurePlannerPrompt = ai.definePrompt({
  name: 'messageStructurePlannerPrompt',
  input: { schema: z.object({
    originalInput: SuggestFormFieldsInputSchema,
    intentAnalysis: IntentAnalysisSchema,
    creativeCopy: CreativeCopySchema
  })},
  output: { schema: MessageStructureSchema },
  prompt: `You are a WhatsApp messaging structure expert who excels at organizing content for maximum impact and readability on mobile devices. Your task is to take the creative copy provided and structure it optimally for WhatsApp business messaging.

## MESSAGE TYPE
{{{originalInput.messageType}}}

## CREATIVE COPY VARIATIONS

### VARIATION 1:
Headline: {{{creativeCopy.variation1.headline}}}
Body: {{{creativeCopy.variation1.body}}}
CTA: {{{creativeCopy.variation1.cta}}}
Tone: {{{creativeCopy.variation1.tone}}}

### VARIATION 2:
Headline: {{{creativeCopy.variation2.headline}}}
Body: {{{creativeCopy.variation2.body}}}
CTA: {{{creativeCopy.variation2.cta}}}
Tone: {{{creativeCopy.variation2.tone}}}

### VARIATION 3:
Headline: {{{creativeCopy.variation3.headline}}}
Body: {{{creativeCopy.variation3.body}}}
CTA: {{{creativeCopy.variation3.cta}}}
Tone: {{{creativeCopy.variation3.tone}}}

## SUGGESTED ELEMENTS
Suggested Emojis: {{{creativeCopy.suggestedEmojis}}}
Key Points to Highlight: {{{creativeCopy.keyHighlights}}}

Your job is to:

1. Structure each message variation for optimal readability on mobile
2. Identify specific elements that should be formatted (bold, italic, strikethrough, monospace)
3. Organize content into appropriate sections with proper spacing
4. Determine where to place emojis for maximum impact
5. Create any bulleted or numbered lists that would enhance readability
6. Ensure the structure follows WhatsApp best practices for the specific message type

For each variation, provide:
- The fully structured content (with all sections in the right order)
- A detailed formatting plan that specifies:
  - Which elements should be bold
  - Which elements should be italic
  - Which elements should have strikethrough
  - Which elements should be in monospace
  - Any bulleted lists (with intro text and items)
  - Any numbered lists (with intro text and items)
  - Where emojis should be placed
  - Where extra spacing should be added

Remember that different message types (marketing, authentication, utility, service) have different structural needs. Tailor your structure to the specific message type while maintaining excellent readability.`
});

// STAGE 4: WhatsApp Formatting Specialist Prompt
const whatsAppFormattingPrompt = ai.definePrompt({
  name: 'whatsAppFormattingPrompt',
  input: { schema: z.object({
    originalInput: SuggestFormFieldsInputSchema,
    intentAnalysis: IntentAnalysisSchema,
    creativeCopy: CreativeCopySchema,
    messageStructure: MessageStructureSchema
  })},
  output: { schema: SuggestFormFieldsOutputSchema },
  prompt: `You are a WhatsApp formatting specialist who excels at applying precise WhatsApp-specific formatting to create professional, engaging, and highly effective business messages. Your task is to take the structured content provided and apply perfect WhatsApp formatting.

## MESSAGE TYPE
{{{originalInput.messageType}}}

## STRUCTURED CONTENT

#### VARIATION 1 STRUCTURE:
Structured Content: {{{messageStructure.variation1.structuredContent}}}

Formatting Plan:
- Bold Elements: {{{messageStructure.variation1.formattingPlan.boldElements}}}
- Italic Elements: {{{messageStructure.variation1.formattingPlan.italicElements}}}
- Strikethrough Elements: {{{messageStructure.variation1.formattingPlan.strikethroughElements}}}
- Monospace Elements: {{{messageStructure.variation1.formattingPlan.monospaceElements}}}
- Bulleted Lists: {{{messageStructure.variation1.formattingPlan.bulletedLists}}}
- Numbered Lists: {{{messageStructure.variation1.formattingPlan.numberedLists}}}
- Emojis: {{{messageStructure.variation1.formattingPlan.emojis}}}
- Spacing: {{{messageStructure.variation1.formattingPlan.spacing}}}

#### VARIATION 2 STRUCTURE:
Structured Content: {{{messageStructure.variation2.structuredContent}}}

Formatting Plan:
- Bold Elements: {{{messageStructure.variation2.formattingPlan.boldElements}}}
- Italic Elements: {{{messageStructure.variation2.formattingPlan.italicElements}}}
- Strikethrough Elements: {{{messageStructure.variation2.formattingPlan.strikethroughElements}}}
- Monospace Elements: {{{messageStructure.variation2.formattingPlan.monospaceElements}}}
- Bulleted Lists: {{{messageStructure.variation2.formattingPlan.bulletedLists}}}
- Numbered Lists: {{{messageStructure.variation2.formattingPlan.numberedLists}}}
- Emojis: {{{messageStructure.variation2.formattingPlan.emojis}}}
- Spacing: {{{messageStructure.variation2.formattingPlan.spacing}}}

#### VARIATION 3 STRUCTURE:
Structured Content: {{{messageStructure.variation3.structuredContent}}}

Formatting Plan:
- Bold Elements: {{{messageStructure.variation3.formattingPlan.boldElements}}}
- Italic Elements: {{{messageStructure.variation3.formattingPlan.italicElements}}}
- Strikethrough Elements: {{{messageStructure.variation3.formattingPlan.strikethroughElements}}}
- Monospace Elements: {{{messageStructure.variation3.formattingPlan.monospaceElements}}}
- Bulleted Lists: {{{messageStructure.variation3.formattingPlan.bulletedLists}}}
- Numbered Lists: {{{messageStructure.variation3.formattingPlan.numberedLists}}}
- Emojis: {{{messageStructure.variation3.formattingPlan.emojis}}}
- Spacing: {{{messageStructure.variation3.formattingPlan.spacing}}}

### SUGGESTED ELEMENTS:
Suggested Emojis: {{{creativeCopy.suggestedEmojis}}}
Key Points to Highlight: {{{creativeCopy.keyHighlights}}}

### WHATSAPP TEMPLATE LIBRARY REFERENCE:

#### MARKETING MESSAGE EXACT PATTERN:
```
[Emoji] *[HEADLINE]* [Emoji]

[Urgency statement]

[Emoji] [Benefit 1]
[Emoji] [Benefit 2]
[Emoji] [Benefit 3]

[Emoji] [CTA]: [link]

[Optional follow-up invitation]
```

#### MARKETING EXAMPLE:
```
🎉 *SUMMER SALE IS LIVE!* 🎉

⏰ Sale ends in 24 hours!

🛍️ Up to 60% off summer wear
🚚 Free shipping on orders over $50
🛒 Shop now: https://bit.ly/SummerSale2025

Need help choosing? Just reply here!
```

#### UTILITY MESSAGE EXACT PATTERN:
```
[Emoji] *[CONFIRMATION TITLE]* [Optional ID]

[Emoji] [Key detail 1]: [Value 1]
[Emoji] [Key detail 2]: [Value 2]
[Emoji] [Key detail 3]: [Value 3]

[Action link or instruction]

[Support message]
```

#### UTILITY EXAMPLE:
```
📦 *Order Confirmed!* #ORD123456

📅 Estimated Delivery: May 25, 2025
🛍️ Items: Wireless Earbuds x1
💰 Total: $79.99

Track your package: https://track.yourstore.com/123456

Need assistance? Just reply to this message.
```

#### AUTHENTICATION MESSAGE EXACT PATTERN:
```
[Security emoji] *[VERIFICATION TITLE]*

Your [verification type] is: *[code]*
[Emoji] [Time limitation information]

⚠️ [Security warning]

[Support information]
```

#### AUTHENTICATION EXAMPLE:
```
🔐 *Verification Code*

Your one-time password is: *123456*
⏳ This code will expire in 5 minutes.

⚠️ Do NOT share this code with anyone.

Having trouble? Contact us at support@yourbrand.com
```

#### SERVICE MESSAGE EXACT PATTERN:
```
Hi [name] [Emoji],

[Acknowledgment of contact]

[Issue summary or response]

[Emoji] [Solution detail 1]
[Emoji] [Solution detail 2]
[Emoji] [Solution detail 3]

[Closing question or next steps]
```

#### SERVICE EXAMPLE:
```
Hi Sarah 👋,

Thanks for contacting us about your recent order.

We've reviewed your case and are issuing a refund for item #EARBUDS234 which was out of stock.

💸 Refund amount: $79.99
🕒 Processed within 3–5 business days

Let us know if you need any clarification!
```

### CRITICAL FORMATTING INSTRUCTIONS:
- ONLY GENERATE THE ACTUAL MESSAGES - Do not explain, describe, or talk about what you're doing
- Follow the EXACT PATTERN for each message type shown above
- Each message MUST match the formatting pattern for its specific message type
- Make the first line bold and attention-grabbing with asterisks (*bold*)
- Always include relevant emojis at the beginning of lines
- Use double line breaks (\\n\\n) between distinct sections
- Use single line breaks (\\n) within related content sections
- Ensure proper spacing for maximum readability on mobile devices
- Check that all formatting syntax is correctly applied and closed (no unclosed formatting)
- Ensure personalization variables are properly formatted (e.g., {{name}}, {{date}})
- Avoid formatting overload - use formatting strategically, not excessively
- Combined Formatting: You can combine certain formats (e.g., *_bold and italic_*) but use sparingly
- Escaping Characters: Use backslash (\\) to escape formatting characters when needed (e.g., \\* shows literal *)

### FINAL REMINDER:
- Follow the EXACT formatting patterns shown in the examples
- Each message must maintain the distinct approach of its variation
- The formatting should enhance readability, engagement, and impact
- Format for mobile-first reading experience (most WhatsApp users are on mobile)
- DO NOT explain what you're doing or talk about the message - JUST WRITE THE THREE MESSAGES

NOW APPLY PERFECT WHATSAPP FORMATTING TO CREATE THREE OUTSTANDING MESSAGES:`
});

// Define the main flow that orchestrates the four stages
const suggestFormFieldsFlow = ai.defineFlow(
  {
    name: 'suggestWhatsAppFormFieldsFlow',
    inputSchema: SuggestFormFieldsInputSchema,
    outputSchema: SuggestFormFieldsOutputSchema,
  },
  async (input: SuggestFormFieldsInput) => {
    // STAGE 1: Intent & Context Analysis
    const intentAnalysis = await intentAnalysisPrompt.generate({
      ...input,
    });

    // STAGE 2: Creative Copywriting
    const creativeCopy = await creativeCopywriterPrompt.generate({
      originalInput: input,
      intentAnalysis,
    });

    // STAGE 3: Message Structure Planning
    const messageStructure = await messageStructurePlannerPrompt.generate({
      originalInput: input,
      intentAnalysis,
      creativeCopy,
    });

    // STAGE 4: WhatsApp Formatting
    const formattedMessages = await whatsAppFormattingPrompt.generate({
      originalInput: input,
      intentAnalysis,
      creativeCopy,
      messageStructure,
    });

    return formattedMessages;
  }
);
