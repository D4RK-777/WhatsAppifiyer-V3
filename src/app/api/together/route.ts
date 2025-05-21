import { NextResponse } from 'next/server';
import Together from 'together-ai';

type ModelType = 'meta-llama/Llama-3.3-70B-Instruct-Turbo' | 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free';

const DEFAULT_MODEL: ModelType = 'meta-llama/Llama-3.3-70B-Instruct-Turbo';

export async function POST(request: Request) {
  try {
    const { messages, model } = await request.json();
    
    if (!process.env.TOGETHER_API_KEY) {
      return NextResponse.json(
        { error: 'TOGETHER_API_KEY environment variable is not set' },
        { status: 500 }
      );
    }

    const together = new Together({
      apiKey: process.env.TOGETHER_API_KEY,
    });

    const selectedModel: ModelType = model || DEFAULT_MODEL;
    
    const response = await together.chat.completions.create({
      messages,
      model: selectedModel,
      temperature: 0.3,
      max_tokens: 1000,
    });

    return NextResponse.json({
      content: response.choices[0].message.content,
      model: selectedModel,
    });
  } catch (error) {
    console.error('Error calling Together AI API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
