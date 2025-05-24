import { NextResponse } from 'next/server';
import { Together } from 'together-ai';

type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

interface Message {
  role: MessageRole;
  content: string;
  name?: string;
}

type ModelType = 'mistralai/Mixtral-8x7B-Instruct-v0.1' | 'mistralai/Mixtral-8x22B-Instruct-v0.1' | 'meta-llama/Llama-3-70b-chat-hf';

const DEFAULT_MODEL: ModelType = 'mistralai/Mixtral-8x7B-Instruct-v0.1';

// Helper function to ensure the API key is available
function getApiKey(): string {
  const apiKey = process.env.TOGETHER_API_KEY;
  if (!apiKey) {
    throw new Error('TOGETHER_API_KEY environment variable is not set');
  }
  return apiKey;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, model: rawModel } = body || {};
    
    if (!messages) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    const apiKey = getApiKey();
    const together = new Together({
      apiKey,
    });

    // Ensure messages is an array and has at least one message
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages must be a non-empty array' },
        { status: 400 }
      );
    }
    
    // Ensure each message has the required properties
    const validMessages = messages.filter((msg: any) => 
      msg && 
      typeof msg === 'object' && 
      'role' in msg && 
      'content' in msg &&
      typeof msg.content === 'string'
    );
    
    if (validMessages.length === 0) {
      return NextResponse.json(
        { error: 'No valid messages found' },
        { status: 400 }
      );
    }

    // Safely get the model parameter with proper typing
    const model = typeof rawModel === 'string' ? rawModel : undefined;
    const selectedModel: ModelType = (model && (model === 'mistralai/Mixtral-8x7B-Instruct-v0.1' || model === 'mistralai/Mixtral-8x22B-Instruct-v0.1' || model === 'meta-llama/Llama-3-70b-chat-hf')) 
      ? model 
      : DEFAULT_MODEL;
    
    // Type assertion for the messages array with proper typing
    const typedMessages = validMessages.map(msg => {
      const roleValue = String(msg.role || 'user').toLowerCase();
      const role = (['system', 'user', 'assistant', 'tool'] as const).includes(roleValue as any)
        ? roleValue as 'system' | 'user' | 'assistant' | 'tool'
        : 'user' as const;
        
      return {
        role,
        content: String(msg.content),
        ...(msg.name && { name: String(msg.name) })
      };
    });
    
    // Create the completion with proper typing
    const completion = await together.chat.completions.create({
      messages: typedMessages,
      model: selectedModel,
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    // Ensure we have a valid response
    if (!completion || !completion.choices || !Array.isArray(completion.choices)) {
      throw new Error('Invalid response from Together API');
    }
    
    const response = {
      id: completion.id || '',
      object: completion.object || 'chat.completion',
      created: completion.created || Math.floor(Date.now() / 1000),
      model: completion.model || selectedModel,
      choices: completion.choices.map((choice: any) => ({
        index: choice.index || 0,
        message: {
          role: choice.message?.role || 'assistant',
          content: choice.message?.content || ''
        },
        finish_reason: choice.finish_reason || 'stop'
      })),
      usage: completion.usage || {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      }
    };

    // Ensure we have at least one choice with content
    const firstChoice = response.choices[0];
    if (!firstChoice || !firstChoice.message) {
      throw new Error('No valid choices in response');
    }

    return NextResponse.json({
      content: firstChoice.message.content || '',
      model: response.model,
      usage: response.usage,
    });
  } catch (error) {
    console.error('Error calling Together AI API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
