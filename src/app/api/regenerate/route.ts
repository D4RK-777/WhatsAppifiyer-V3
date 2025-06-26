import { NextResponse } from 'next/server';
import { generateMultiProviderSuggestions } from '@/ai/flows/form-suggestion-multi';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the input
    if (!body.originalText) {
      return NextResponse.json(
        { error: 'Original text is required' },
        { status: 400 }
      );
    }

    if (!body.messageType) {
      return NextResponse.json(
        { error: 'Message type is required' },
        { status: 400 }
      );
    }

    if (!body.fieldToRegenerate) {
      return NextResponse.json(
        { error: 'Field to regenerate is required' },
        { status: 400 }
      );
    }

    // Generate a new message variation using the multi-provider function
    const result = await generateMultiProviderSuggestions({
      context: body.originalText,
      messageType: body.messageType,
      mediaType: body.mediaType || 'standard',
      tone: body.tone || 'professional',
      // Pass the appropriate field based on which one is being regenerated
      field1: body.fieldToRegenerate === 'field1' ? body.originalText : '',
      field2: body.fieldToRegenerate === 'field2' ? body.originalText : '',
      field3: body.fieldToRegenerate === 'field3' ? body.originalText : ''
    });
    
    // Extract the appropriate suggestion based on the field
    let regeneratedText = '';
    switch (body.fieldToRegenerate) {
      case 'field1':
        regeneratedText = result.suggestion1;
        break;
      case 'field2':
        regeneratedText = result.suggestion2;
        break;
      case 'field3':
        regeneratedText = result.suggestion3;
        break;
      default:
        regeneratedText = result.suggestion1;
    }
    
    return NextResponse.json({
      regeneratedText: regeneratedText
    });
  } catch (error) {
    console.error('Error in regenerate API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
