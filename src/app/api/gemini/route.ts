import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    // Use the Google API key from environment variables
    const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyDmdQQTq4xETLS1b8aorJE42Su1JCRqUac';

    // Initialize the Google Generative AI with the API key
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    const response = result.response;
    
    return NextResponse.json({
      content: response.text(),
      model: 'gemini-1.5-flash',
    });
  } catch (error) {
    console.error('Error calling Google Gemini API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
