import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Use a stable model that's compatible with the API
export const ai = genkit({
  plugins: [googleAI({
    apiKey: (() => {
      const key = process.env.GOOGLE_AI_API_KEY;
      if (!key) {
        console.error('Google AI API key is not configured');
        throw new Error('Google AI API key is not configured');
      }
      return key;
    })()
  })],
  model: 'googleai/gemini-2.0-flash'
});
