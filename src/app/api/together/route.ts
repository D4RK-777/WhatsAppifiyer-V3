import { NextResponse } from 'next/server';
import Together from 'together-ai';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    
    if (!process.env.TOGETHER_API_KEY) {
      return NextResponse.json(
        { error: 'TOGETHER_API_KEY environment variable is not set' },
        { status: 500 }
      );
    }

    const together = new Together({
      apiKey: process.env.TOGETHER_API_KEY,
    });

    const response = await together.chat.completions.create({
      messages,
      model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    });

    return NextResponse.json({
      content: response.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error calling Together AI API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
