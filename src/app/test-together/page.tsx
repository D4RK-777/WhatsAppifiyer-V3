'use client';

import { useState } from 'react';

type ApiProvider = 'together' | 'openrouter';

export default function TestTogether() {
  const [input, setInput] = useState('What are some fun things to do in New York?');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiProvider, setApiProvider] = useState<ApiProvider>('together');
  const [openRouterKey, setOpenRouterKey] = useState('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');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse('');
    
    try {
      if (apiProvider === 'together') {
        const res = await fetch('/api/together', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              { role: 'user', content: input },
            ],
          }),
        });
        const data = await res.json();
        setResponse(data.content || data.error || 'No response');
      } else {
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
            model: 'deepseek/deepseek-r1-distill-qwen-32b:free',
            messages: [
              {
                role: 'user',
                content: input
              }
            ]
          })
        });
        
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error?.message || 'Failed to fetch from OpenRouter');
        }
        
        const data = await res.json();
        setResponse(data.choices?.[0]?.message?.content || 'No response');
      }
    } catch (error: any) {
      console.error('Error:', error);
      setResponse(`Error: ${error.message || 'Failed to process request'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">AI API Test Page</h1>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex space-x-4 mb-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              checked={apiProvider === 'together'}
              onChange={() => setApiProvider('together')}
            />
            <span className="ml-2">Together AI</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              checked={apiProvider === 'openrouter'}
              onChange={() => setApiProvider('openrouter')}
            />
            <span className="ml-2">OpenRouter (DeepSeek)</span>
          </label>
        </div>

        {apiProvider === 'openrouter' && (
          <div className="mb-4">
            <label htmlFor="openrouter-key" className="block text-sm font-medium mb-1">
              OpenRouter API Key:
            </label>
            <input
              type="password"
              id="openrouter-key"
              value={openRouterKey}
              onChange={(e) => setOpenRouterKey(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your OpenRouter API key"
            />
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium mb-2">
            Enter your prompt:
          </label>
          <textarea
            id="prompt"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-2 border rounded h-32"
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || (apiProvider === 'openrouter' && !openRouterKey)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Sending...' : `Send to ${apiProvider === 'together' ? 'Together AI' : 'OpenRouter'}`}
        </button>
      </form>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Response:</h2>
        <div className="p-4 bg-gray-100 rounded min-h-40 whitespace-pre-wrap">
          {isLoading ? 'Waiting for response...' : response || 'No response yet'}
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400">
        <h3 className="font-bold mb-2">Note:</h3>
        <p className="text-sm">
          {apiProvider === 'together' ? (
            <>Make sure to set the <code className="bg-gray-200 px-1 rounded">TOGETHER_API_KEY</code> environment variable in your <code className="bg-gray-200 px-1 rounded">.env.local</code> file.</>
          ) : (
            <>Using OpenRouter with DeepSeek R1 Distill Qwen 32B model. Your API key is stored in the browser only.</>
          )}
        </p>
      </div>
    </div>
  );
}
