import { NextResponse } from 'next/server';
import { suggestFormFields } from '@/ai/flows/form-suggestion';
import { SuggestFormFieldsInput } from '@/ai/flows/form-suggestion';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the input
    if (!body.context) {
      return NextResponse.json(
        { error: 'Context is required' },
        { status: 400 }
      );
    }

    if (!body.messageType) {
      return NextResponse.json(
        { error: 'Message type is required' },
        { status: 400 }
      );
    }

    const input: SuggestFormFieldsInput = {
      context: body.context,
      messageType: body.messageType,
      field1: body.field1 || '',
      field2: body.field2 || '',
      field3: body.field3 || ''
    };

    const result = await suggestFormFields(input);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in suggestions API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
