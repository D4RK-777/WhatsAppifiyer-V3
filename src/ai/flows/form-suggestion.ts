
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
  prompt: `You are an award-winning creative copywriter with exceptional skills in crafting viral, emotionally resonant, and conversion-focused messages. Your ONLY task is to create the core content for THREE DISTINCT, highly effective WhatsApp messages that will captivate, engage, and drive action. Your writing must be so good it could win advertising awards.

### USER INPUT:
Message Type: {{{originalInput.messageType}}}

User's Original Text/Idea:
{{{originalInput.context}}}

Optional initial content for variations (if provided):
Field 1: {{{originalInput.field1}}}
Field 2: {{{originalInput.field2}}}
Field 3: {{{originalInput.field3}}}

### INTENT ANALYSIS:
Core Intent: {{{intentAnalysis.coreIntent}}}
Tone of Voice: {{{intentAnalysis.toneOfVoice}}}
Key Elements: {{{intentAnalysis.keyElements}}}
Target Audience: {{{intentAnalysis.targetAudience}}}
Contextual Nuance: {{{intentAnalysis.contextualNuance}}}
Creative Suggestions: {{{intentAnalysis.creativeSuggestions}}}
Emotional Hooks: {{{intentAnalysis.emotionalHooks}}}
Psychological Principles: {{{intentAnalysis.psychologicalPrinciples}}}

### CRITICAL INSTRUCTIONS FOR EXCEPTIONAL WRITING:
- Create content that is MEMORABLE, SHAREABLE, and ACTIONABLE
- Craft headlines that are impossible to ignore - they must stop people mid-scroll
- Write with personality and flair - avoid generic, corporate-sounding language at all costs
- Use conversational language that feels like a message from a friend, not a brand
- Inject humor, wit, and unexpected twists where appropriate
- Create emotional resonance through storytelling and relatable scenarios
- Use powerful, vivid language that creates mental images
- Each variation must have a completely different angle, tone, and approach
- Make your copy so good that people would want to screenshot and share it

### STRUCTURE AND ELEMENTS:
- For each variation, create: 
  * An attention-grabbing headline that hooks instantly
  * Engaging body content that builds interest and desire
  * An irresistible call-to-action that feels urgent and valuable
- Use short, punchy sentences mixed with occasional longer ones for rhythm
- Create a natural flow that leads the reader effortlessly to the call-to-action
- Suggest perfect emojis that enhance the message's emotional impact
- Identify key phrases that should be highlighted for maximum impact

### MESSAGE TYPE-SPECIFIC EXCELLENCE:

FOR MARKETING MESSAGES:
- Create FOMO (fear of missing out) through scarcity, exclusivity, or time limits
- Focus on unexpected benefits and emotional outcomes, not just features
- Use power words that trigger desire: exclusive, limited, secret, premium, etc.
- Create a sense of insider access or special opportunity
- Make the CTA feel like a privilege, not a request
- Use psychological triggers like social proof, authority, and reciprocity

FOR AUTHENTICATION MESSAGES:
- Balance security with friendliness - avoid sounding robotic
- Create trust through clarity and professionalism without being boring
- Add subtle personality touches that make verification feel less transactional
- Make security feel empowering rather than burdensome
- Create a sense of protection and care through your language

FOR UTILITY MESSAGES:
- Transform mundane information into engaging, useful content
- Make instructions feel simple and effortless to follow
- Create clarity through creative organization and presentation
- Add unexpected helpful tips or insights that provide extra value
- Make status updates feel personal and relevant

FOR SERVICE MESSAGES:
- Convey genuine empathy that feels authentic, not scripted
- Balance professionalism with warmth and personality
- Transform problem-solving into a positive experience
- Make the customer feel valued, heard, and appreciated
- Create confidence through competent, clear communication

### INSPIRATION FROM WORLD-CLASS COPYWRITING:
- Channel the conversational style of top direct response copywriters
- Study the emotional appeal of the best viral social media posts
- Learn from the clarity and persuasiveness of top-converting landing pages
- Incorporate the personality and engagement of the most popular influencers
- Adapt the storytelling techniques of award-winning advertisements

### FINAL REMINDER:
- Push your creativity to its absolute limits - be bold and original
- Each variation must feel completely fresh and distinctive
- Your writing should surprise and delight while still being strategic
- The content should be so good it could be featured in a copywriting masterclass
- Focus on creating content that people would genuinely enjoy receiving

NOW CREATE THREE EXTRAORDINARY MESSAGE VARIATIONS THAT DEMONSTRATE THE VERY BEST OF CREATIVE COPYWRITING:`
});

// Define the combined input schema for whatsAppFormattingPrompt
const WhatsAppFormattingInputSchema = z.object({
  originalInput: SuggestFormFieldsInputSchema,
  intentAnalysis: IntentAnalysisSchema,
  creativeCopy: CreativeCopySchema,
  messageStructure: MessageStructureSchema
});

// STAGE 4: WhatsApp Formatting Specialist Prompt
const whatsAppFormattingPrompt = ai.definePrompt({
  name: 'whatsAppFormattingPrompt',
  input: {schema: WhatsAppFormattingInputSchema}, // Use the pre-defined schema
  output: {schema: SuggestFormFieldsOutputSchema},
  prompt: `You are a world-class WhatsApp B2C formatting specialist with exceptional skills in optimizing messages for maximum impact, engagement, and conversion. Your ONLY task is to take the creative content and structure plan provided and apply perfect WhatsApp-specific formatting to create THREE DISTINCT, highly effective WhatsApp messages that adhere to all B2C messaging best practices.  
### USER INPUT:
Message Type: {{{originalInput.messageType}}}

### INTENT ANALYSIS:
Core Intent: {{{intentAnalysis.coreIntent}}}
Tone of Voice: {{{intentAnalysis.toneOfVoice}}}
Target Audience: {{{intentAnalysis.targetAudience}}}
Contextual Nuance: {{{intentAnalysis.contextualNuance}}}
Psychological Principles: {{{intentAnalysis.psychologicalPrinciples}}}

### CREATIVE CONTENT TO FORMAT:

#### VARIATION 1:
Headline: {{{creativeCopy.variation1.headline}}}
Body: {{{creativeCopy.variation1.body}}}
CTA: {{{creativeCopy.variation1.cta}}}
Tone: {{{creativeCopy.variation1.tone}}}

#### VARIATION 2:
Headline: {{{creativeCopy.variation2.headline}}}
Body: {{{creativeCopy.variation2.body}}}
CTA: {{{creativeCopy.variation2.cta}}}
Tone: {{{creativeCopy.variation2.tone}}}

#### VARIATION 3:
Headline: {{{creativeCopy.variation3.headline}}}
Body: {{{creativeCopy.variation3.body}}}
CTA: {{{creativeCopy.variation3.cta}}}
Tone: {{{creativeCopy.variation3.tone}}}

### MESSAGE STRUCTURE PLANS:

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

### CRITICAL INSTRUCTIONS:
- ONLY GENERATE THE ACTUAL MESSAGES - Do not explain, describe, or talk about what you're doing
- Each message MUST use WhatsApp formatting effectively and appropriately for its specific message type
- Apply formatting to enhance readability, engagement, and impact
- Strategically place emojis to enhance the message (not just decorate)
- Create visual hierarchy through formatting choices
- Make the first line bold and attention-grabbing (it will be the preview text)
- Ensure proper spacing for maximum readability on mobile devices
- Check that all formatting syntax is correctly applied and closed (no unclosed formatting)
- Ensure personalization variables are properly formatted (e.g., {{1}}, {{2}})
- Avoid formatting overload - use formatting strategically, not excessively

### WHATSAPP FORMATTING TECHNIQUES:
- Bold (*text*): Use for headlines, CTAs, key information - makes text stand out
- Italic (_text_): Use for subtle emphasis, product names, foreign words
- Strikethrough (~text~): Use for price reductions, corrections, outdated info
- Monospace (\`\`\`text\`\`\`): Use for codes, technical information, pre-formatted text
- Bulleted Lists (- item): Use for features, benefits, options (unordered items)
- Numbered Lists (1. item): Use for steps, instructions, ranked items (ordered items)
- Block Quotes (> text): Use for testimonials, important notices, quoted content
- Inline Code (\`text\`): Use for highlighting UI elements or specific terms
- Combined Formatting: You can combine certain formats (e.g., *_bold italic_*) but use sparingly
- Escaping Characters: Use backslash (\\) to escape formatting characters when needed (e.g., \\* shows literal *)

### MESSAGE TYPE-SPECIFIC FORMATTING STRATEGIES:

FOR MARKETING MESSAGES:
- Make the headline bold and add 1-2 relevant emojis at the end of the headline
- Use strikethrough for original prices to highlight discounts (~$99~ $79)
- Use monospace for discount codes and offer codes (\`\`\`SAVE20\`\`\`)
- Bold the CTA and add an action emoji at the end (*Shop Now* 🛍️)
- Create a clear visual hierarchy: bold headline → descriptive body → strong CTA
- Limit total emojis to 3-5 strategically placed throughout the message
- Use double line breaks before and after the CTA for visual separation
- For promotional messages, create a sense of urgency with formatting (e.g., bold limited-time offers)
- Highlight benefits rather than features using subtle formatting (italics for benefits)

FOR AUTHENTICATION MESSAGES:
- Keep formatting minimal and professional - security is the priority
- Use bold only for critical information or instructions (*Verification Code*)
- Use monospace for verification codes, PINs, or passwords (\`\`\`123456\`\`\`)
- Limit emojis to 0-1 security-related symbols if appropriate (🔒)
- Clearly separate verification codes from surrounding text using line breaks
- Never format security information in a way that could be confusing
- Use numbered lists for sequential steps if applicable
- Maintain a clean, trustworthy appearance with minimal decoration
- Ensure any time-sensitive information (expiration) is clearly formatted (bold)

FOR UTILITY MESSAGES:
- Use bold for important status updates or action items (*Order Shipped*)
- Use numbered lists for sequential instructions (1. Check status 2. Confirm receipt)
- Use monospace for order numbers, tracking codes, or reference IDs (\`\`\`ORD-12345\`\`\`)
- Include 1-3 relevant emojis that clarify the message purpose (📦 for shipping)
- Format for maximum clarity and scannability with clear section breaks
- Use block quotes for important notices or policy information
- Highlight time-sensitive information with appropriate formatting
- Create clear visual separation between different pieces of information
- Ensure the most important information stands out visually

FOR SERVICE MESSAGES:
- Use bold for key service information or status updates (*Issue Resolved*)
- Use bulleted lists to break down multiple points (* We've credited your account)
- Use block quotes for policy information or important notices (> Please note our policy)
- Include 1-2 appropriate emojis that convey the right tone (✅ for confirmation)
- Format to convey professionalism and helpfulness with clean spacing
- Ensure any required actions are clearly highlighted with bold formatting
- Use italics for empathetic statements to convey a human touch
- Create a balance between informational content and supportive tone
- Format any follow-up options clearly and distinctly

### SPACING AND STRUCTURE PRINCIPLES:
- Use double line breaks (\n\n) between distinct sections for clear visual separation
- After greetings, always add a double line break to set apart the introduction
- Before CTAs or important conclusions, add a double line break for emphasis
- Use single line breaks within related content sections to maintain grouping
- Ensure proper spacing for maximum readability on mobile devices
- Limit consecutive line breaks to two maximum (no more than \n\n)
- Group related information visually through consistent spacing
- Create a logical flow from introduction → body → conclusion/CTA
- Use paragraph breaks strategically to improve scannability
- Ensure the message has a clear beginning, middle, and end structure

### ACCESSIBILITY AND READABILITY CONSIDERATIONS:
- Place emojis at the end of sentences/phrases, not in the middle of text
- Limit emoji usage to what's necessary for communication (not decoration)
- Ensure essential information is conveyed through text, not just emojis
- Maintain high contrast between formatted and unformatted text
- Avoid complex formatting combinations that could confuse screen readers
- Ensure the message makes sense even if formatting were removed
- Use formatting to enhance meaning, not just for visual appeal
- Create a clear hierarchy of information through formatting choices
- Format in a way that guides the eye through the most important points

### COMMON FORMATTING PITFALLS TO AVOID:
- Unclosed formatting tags (e.g., *bold text without closing asterisk)
- Overuse of a single formatting type (e.g., too many bold sections)
- Inconsistent formatting patterns across similar elements
- Formatting that breaks when personalization variables are inserted
- Excessive emoji usage that makes the message look unprofessional
- Formatting that creates visual clutter rather than clarity
- Improper nesting of formatting elements
- Formatting that doesn't match the message tone or purpose
- Using formatting without clear purpose or strategy

### FINAL QUALITY CHECKLIST:
- Is the first line bold and attention-grabbing? (Preview text optimization)
- Are all formatting tags properly closed?
- Is the formatting appropriate for this specific message type?
- Does the formatting enhance rather than distract from the message?
- Is there a clear visual hierarchy that guides the reader?
- Are emojis used strategically and appropriately?
- Is spacing used effectively to improve readability?
- Does the CTA stand out visually?
- Is the overall formatting consistent with brand voice and tone?
- Would this message render correctly across all WhatsApp clients?

### FINAL REMINDER:
- DO NOT explain what you're doing or talk about the message - JUST WRITE THE THREE MESSAGES
- Each message must be complete, properly formatted, and ready to send
- Each message must maintain the distinct approach of its variation
- The formatting should enhance readability, engagement, and impact
- Format for mobile-first reading experience (most WhatsApp users are on mobile)

NOW APPLY PERFECT WHATSAPP FORMATTING TO CREATE THREE OUTSTANDING MESSAGES:`
});

// Stage 3: Message Structure Planner - Plans the structure and elements to highlight
const messageStructurePlannerPrompt = ai.definePrompt({
  name: 'messageStructurePlannerPrompt',
  input: {schema: z.object({
    originalInput: SuggestFormFieldsInputSchema,
    intentAnalysis: IntentAnalysisSchema,
    creativeCopy: CreativeCopySchema
  })},
  output: {schema: MessageStructureSchema},
  prompt: `You are a WhatsApp message structure expert who specializes in planning the optimal structure and formatting for B2C WhatsApp messages. Your task is to take the creative content provided and plan exactly how it should be structured and formatted for maximum impact and readability on WhatsApp.

WhatsApp supports these formatting options:
- *Bold* (use asterisks): For important information, headings, prices, dates, times
- _Italic_ (use underscores): For emphasis, quotes, product names
- ~Strikethrough~ (use tildes): For discounts, price reductions, changes to information
- \`\`\`Monospace\`\`\` (use triple backticks): For codes, quotes, or to set text apart
- Bulleted lists: For features, benefits, steps (use - symbol)
- Numbered lists: For sequential steps, ranked items (use 1., 2., etc.)
- Emojis: For visual appeal and emotional connection
- Line breaks: For readability and visual separation

### USER INPUT:
Message Type: {{{originalInput.messageType}}}
Context: {{{originalInput.context}}}

### INTENT ANALYSIS:
Core Intent: {{{intentAnalysis.coreIntent}}}
Tone of Voice: {{{intentAnalysis.toneOfVoice}}}
Key Elements: {{{intentAnalysis.keyElements}}}

### CREATIVE CONTENT TO STRUCTURE:

#### VARIATION 1:
Headline: {{{creativeCopy.variation1.headline}}}
Body: {{{creativeCopy.variation1.body}}}
CTA: {{{creativeCopy.variation1.cta}}}
Tone: {{{creativeCopy.variation1.tone}}}

#### VARIATION 2:
Headline: {{{creativeCopy.variation2.headline}}}
Body: {{{creativeCopy.variation2.body}}}
CTA: {{{creativeCopy.variation2.cta}}}
Tone: {{{creativeCopy.variation2.tone}}}

#### VARIATION 3:
Headline: {{{creativeCopy.variation3.headline}}}
Body: {{{creativeCopy.variation3.body}}}
CTA: {{{creativeCopy.variation3.cta}}}
Tone: {{{creativeCopy.variation3.tone}}}

### SUGGESTED ELEMENTS:
Suggested Emojis: {{{creativeCopy.suggestedEmojis}}}
Key Points to Highlight: {{{creativeCopy.keyHighlights}}}

For each of the three message variations, create:
1. A structured content plan that organizes the message elements (greeting, headline, body, CTA) with proper spacing
2. A detailed formatting plan that specifies:
   - Which exact text elements should be bold, italic, strikethrough, or monospace
   - Where to use bulleted or numbered lists and what items to include
   - Where to place emojis for maximum impact
   - Where to add line breaks for better readability

Remember these WhatsApp formatting best practices:
- Don't overuse formatting - be selective and purposeful
- Ensure there are no spaces between formatting symbols and text
- Format complete phrases rather than single words when possible
- Use line breaks strategically to improve readability
- For lists, ensure each item is on its own line
- Combine formatting types carefully (e.g., *_bold italic_*) and close them in reverse order
- Monospace cannot be combined with other formatting

Your goal is to create a clear, visually appealing message structure that enhances readability and drives action.`
});

// Four-stage flow that analyzes intent, creates content, plans structure, then applies formatting
const suggestFormFieldsFlow = ai.defineFlow(
  {
    name: 'suggestWhatsAppFormFieldsFlow',
    inputSchema: SuggestFormFieldsInputSchema,
    outputSchema: SuggestFormFieldsOutputSchema,
  },
  async input => {
    try {
      // Stage 1: Intent & Context Analyzer - Deeply understand the intent, tone, and context
      console.log('Starting Stage 1: Intent & Context Analysis');
      const intentAnalysisResult = await intentAnalysisPrompt(input);
      if (!intentAnalysisResult.output) {
        throw new Error('Intent analysis failed to produce output');
      }
      const intentAnalysis = intentAnalysisResult.output;
      console.log('Stage 1 complete: Intent analysis successful');
      
      // Stage 2: Creative Copywriter - Craft compelling message content
      console.log('Starting Stage 2: Creative Copywriting');
      const creativeCopyResult = await creativeCopywriterPrompt({
        originalInput: input,
        intentAnalysis: intentAnalysis
      });
      
      if (!creativeCopyResult.output) {
        throw new Error('Creative copywriting failed to produce output');
      }
      const creativeCopy = creativeCopyResult.output;
      console.log('Stage 2 complete: Creative copy generated');
      
      // Stage 3: Message Structure Planner - Plan the structure and formatting elements
      console.log('Starting Stage 3: Message Structure Planning');
      const messageStructureResult = await messageStructurePlannerPrompt({
        originalInput: input,
        intentAnalysis: intentAnalysis,
        creativeCopy: creativeCopy
      });
      
      if (!messageStructureResult.output) {
        throw new Error('Message structure planning failed to produce output');
      }
      const messageStructure = messageStructureResult.output;
      console.log('Stage 3 complete: Message structure planned');
      
      // Stage 4: WhatsApp Formatting Specialist - Apply optimal formatting
      console.log('Starting Stage 4: WhatsApp Formatting');
      const formattingResult = await whatsAppFormattingPrompt({
        originalInput: input,
        intentAnalysis: intentAnalysis,
        creativeCopy: creativeCopy,
        messageStructure: messageStructure
      });
      
      if (!formattingResult.output) {
        throw new Error('WhatsApp formatting failed to produce output');
      }
      console.log('Stage 4 complete: WhatsApp formatting applied');
      
      return formattingResult.output;
    } catch (error: any) {
      console.error('Error in four-stage AI flow:', error);
      // Log detailed error information for debugging
      console.error('Error details:', error.message);
      
      // Throw the error to be handled by the caller
      throw error;
    }
  }
);
