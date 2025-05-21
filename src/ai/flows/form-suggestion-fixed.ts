'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Simple test function
export function testFunction() {
  return { success: true };
}

export async function suggestFormFields(input: any) {
  return {
    suggestion1: "Test suggestion 1",
    suggestion2: "Test suggestion 2",
    suggestion3: "Test suggestion 3"
  };
}
