import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Use a stable model that's compatible with the API
export const ai = genkit({
  plugins: [googleAI({
    apiKey: process.env.GOOGLE_AI_API_KEY || 'AIzaSyDmdQQTq4xETLS1b8aorJE42Su1JCRqUac'
  })],
  model: 'googleai/gemini-2.0-flash'
});
