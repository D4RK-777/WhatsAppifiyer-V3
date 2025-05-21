'use client';

import { useState } from 'react';

type ApiProvider = 'together-llama' | 'together-deepseek' | 'openrouter' | 'google-gemini';

const MODEL_NAMES = {
  'together-llama': 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
  'together-deepseek': 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free',
  'openrouter': 'deepseek/deepseek-r1-distill-qwen-32b:free',
  'google-gemini': 'gemini-1.5-flash'
};

export default function TestTogether() {
  const [input, setInput] = useState('What are some fun things to do in New York?');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiProvider, setApiProvider] = useState<ApiProvider>('together-llama');
  const [openRouterKey, setOpenRouterKey] = useState('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');
  const [googleApiKey, setGoogleApiKey] = useState('AIzaSyDmdQQTq4xETLS1b8aorJE42Su1JCRqUac');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse('');
    
    try {
      if (apiProvider.startsWith('together-')) {
        const model = MODEL_NAMES[apiProvider as keyof typeof MODEL_NAMES];
        const res = await fetch('/api/together', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: 'You are a helpful assistant. Provide only the final response with no explanations, thinking, or additional text.'
              },
              { 
                role: 'user', 
                content: input 
              }
            ],
            model,
            temperature: 0.3
          }),
        });
        const data = await res.json();
        setResponse(data.content || data.error || 'No response');
      } else if (apiProvider === 'openrouter') {
        // Call OpenRouter API directly
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openRouterKey}`,
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'WhatsAppifiyer Test',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: MODEL_NAMES.openrouter,
            messages: [
              {
                role: 'system',
                content: 'You are a helpful assistant. Provide only the final response with no explanations, thinking, or additional text.'
              },
              {
                role: 'user',
                content: input
              }
            ],
            temperature: 0.3
          })
        });
        
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error?.message || 'Failed to fetch from OpenRouter');
        }
        
        const data = await res.json();
        setResponse(data.choices?.[0]?.message?.content || 'No response');
      } else if (apiProvider === 'google-gemini') {
        // Call Google Gemini API
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${googleApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `You are a helpful assistant. Provide only the final response with no explanations, thinking, or additional text.\n\nUser: ${input}`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.3,
              topP: 0.95,
              topK: 64,
              maxOutputTokens: 8192,
            },
          })
        });
        
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error?.message || 'Failed to fetch from Google Gemini');
        }
        
        const data = await res.json();
        setResponse(data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response');
      }
    } catch (error: any) {
      console.error('Error:', error);
      setResponse(`Error: ${error.message || 'Failed to process request'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="test-together-page container mx-auto p-4 max-w-4xl">
      <h1 className="test-together-title text-2xl font-bold mb-4">AI API Test Page</h1>
      
      <div className="test-together-provider-section mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="test-together-provider-options flex space-x-4 mb-4">
          <label className="test-together-provider-option inline-flex items-center">
            <input
              type="radio"
              className="test-together-radio form-radio"
              checked={apiProvider === 'together-llama'}
              onChange={() => setApiProvider('together-llama')}
            />
            <span className="test-together-provider-label ml-2">Together AI (Llama 3 70B)</span>
          </label>
          <label className="test-together-provider-option inline-flex items-center">
            <input
              type="radio"
              className="test-together-radio form-radio"
              checked={apiProvider === 'together-deepseek'}
              onChange={() => setApiProvider('together-deepseek')}
            />
            <span className="test-together-provider-label ml-2">Together AI (DeepSeek 70B)</span>
          </label>
          <label className="test-together-provider-option inline-flex items-center">
            <input
              type="radio"
              className="test-together-radio form-radio"
              checked={apiProvider === 'openrouter'}
              onChange={() => setApiProvider('openrouter')}
            />
            <span className="test-together-provider-label ml-2">OpenRouter (DeepSeek)</span>
          </label>
          <label className="test-together-provider-option inline-flex items-center">
            <input
              type="radio"
              className="test-together-radio form-radio"
              checked={apiProvider === 'google-gemini'}
              onChange={() => setApiProvider('google-gemini')}
            />
            <span className="test-together-provider-label ml-2">Google Gemini 2.0 Flash</span>
          </label>
        </div>

        {apiProvider === 'google-gemini' && (
          <div className="test-together-google-key-container mb-4">
            <label htmlFor="test-together-google-key" className="test-together-google-key-label block text-sm font-medium mb-1">
              Google API Key:
            </label>
            <input
              type="password"
              id="test-together-google-key"
              value={googleApiKey}
              onChange={(e) => setGoogleApiKey(e.target.value)}
              className="test-together-google-key-input w-full p-2 border rounded"
              placeholder="Enter your Google API key"
            />
          </div>
        )}
        {apiProvider === 'openrouter' && (
          <div className="test-together-openrouter-key-container mb-4">
            <label htmlFor="test-together-openrouter-key" className="test-together-openrouter-key-label block text-sm font-medium mb-1">
              OpenRouter API Key:
            </label>
            <input
              type="password"
              id="test-together-openrouter-key"
              value={openRouterKey}
              onChange={(e) => setOpenRouterKey(e.target.value)}
              className="test-together-openrouter-key-input w-full p-2 border rounded"
              placeholder="Enter your OpenRouter API key"
            />
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="test-together-form space-y-4">
        <div className="test-together-input-group">
          <label htmlFor="test-together-input" className="test-together-label block text-sm font-medium text-gray-700 mb-1">
            Your Message
          </label>
          <div className="test-together-input-container flex flex-col space-y-2 w-full">
            <textarea
              id="test-together-input"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto-expand the textarea
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 300)}px`;
              }}
              onKeyDown={(e) => {
                // Auto-expand on key down as well
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              className="test-together-input w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] max-h-[300px] resize-y"
              placeholder="Type your message..."
              rows={5}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="test-together-submit-btn px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="test-together-spinner animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="test-together-submit-text">Sending...</span>
                </>
              ) : (
                <span className="test-together-submit-text">
                  Send to {
                    apiProvider === 'openrouter' ? 'OpenRouter' : 
                    apiProvider === 'google-gemini' ? 'Google Gemini' : 
                    'Together AI'
                  }
                </span>
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="test-together-response-section mt-6">
        <h2 className="test-together-response-title text-xl font-semibold mb-2">Response:</h2>
        <div className="test-together-response-content p-4 bg-gray-100 rounded min-h-40 whitespace-pre-wrap">
          {isLoading ? (
            <span className="test-together-loading-text">Waiting for response...</span>
          ) : (
            <span className="test-together-response-text">{response || 'No response yet'}</span>
          )}
        </div>
      </div>

      <div className="test-together-note mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400">
        <h3 className="test-together-note-title font-bold mb-2">Note:</h3>
        <p className="test-together-note-text text-sm">
          {apiProvider === 'google-gemini' ? (
            <>
              Using Google Gemini 2.0 Flash model. Your API key is stored in the browser only.
              {googleApiKey.startsWith('AIza') && (
                <div className="mt-2 p-2 bg-green-50 text-green-700 text-xs rounded">
                  Using default Google API key. For production, use your own key.
                </div>
              )}
            </>
          ) : apiProvider.includes('together') ? (
            <>
              Make sure to set the{' '}
              <code className="test-together-code bg-gray-200 px-1 rounded">TOGETHER_API_KEY</code>{' '}
              environment variable in your{' '}
              <code className="test-together-code bg-gray-200 px-1 rounded">.env.local</code> file.
              {apiProvider === 'together-llama' ? (
                <span> Using Llama 3 70B model.</span>
              ) : (
                <span> Using DeepSeek R1 Distill Llama 70B model.</span>
              )}
            </>
          ) : (
            <>
              Using OpenRouter with DeepSeek R1 Distill Qwen 32B model. Your API key is stored in the browser only.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
