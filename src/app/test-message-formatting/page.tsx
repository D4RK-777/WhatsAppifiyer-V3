'use client';

import React, { useState } from 'react';

export default function TestMessageFormatting() {
  const [input, setInput] = useState(
    'Hello! Our summer collection is live with curated styles just for you. Enjoy free shipping on orders over R500 and earn double loyalty points this week. Sign up in our app to get early access to new arrivals and exclusive member deals. Shop securely with one-click checkout and track your order in real time. Thanks for being part of our community—happy styling!'
  );
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiProvider, setApiProvider] = useState<'openrouter' | 'together-llama' | 'together-deepseek' | 'google-gemini'>('together-deepseek');
  const [openRouterKey, setOpenRouterKey] = useState('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');
  const [googleApiKey, setGoogleApiKey] = useState('AIzaSyDmdQQTq4xETLS1b8aorJE42Su1JCRqUac');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  
  // Format text for WhatsApp preview with actual HTML/CSS styling
  const formatForPreview = (text: string) => {
    if (!text) return '';
    
    // Convert markdown to HTML with WhatsApp styling
    let html = text
      // Handle bold with single asterisk
      .replace(/\*([^*]+?)\*(?![*])/g, '<strong>$1</strong>')
      // Handle italic with single underscore
      .replace(/_([^_]+?)_(?![_])/g, '<em>$1</em>')
      // Handle strikethrough
      .replace(/~([^~]+?)~/g, '<span style="text-decoration: line-through">$1</span>')
      // Handle monospace blocks
      .replace(/```([\s\S]*?)```/g, '<code>$1</code>')
      // Convert line breaks to <br> for proper spacing
      .replace(/\n/g, '<br>');
      
    return html;
  };
  
  // Format text for raw output (keeps markdown for copying)
  const formatForRawOutput = (text: string) => {
    if (!text) return '';
    // Clean up common markdown issues
    return text
      // Fix double asterisks (convert ****bold**** to **bold**)
      .replace(/\*\*\*\*(.*?)\*\*\*\*/g, '**$1**')
      // Ensure single asterisks for bold
      .replace(/([^\\])\*\*/g, '$1*')
      // Ensure single underscores for italics
      .replace(/([^_])__/g, '$1_')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim();
  };
  
  const MODEL_NAMES = {
    'together-llama': 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    'together-deepseek': 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free',
    'openrouter': 'deepseek/deepseek-r1-distill-qwen-32b:free',
    'google-gemini': 'gemini-1.5-flash'
  };

  const callAI = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setOutput('');
    
    try {
      let result = '';
      
      if (apiProvider === 'google-gemini') {
        // Call Google Gemini API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${googleApiKey}`, {
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
                    text: `You are a WhatsApp formatting expert. Format the following marketing message with perfect WhatsApp styling.\n\n` +
                    `RULES:\n` +
                    `1. ONLY return the final formatted message - NO explanations, thinking, or notes\n` +
                    `2. Use WhatsApp formatting: *bold*, _italic_, ~strikethrough~, \`\`\`monospace\`\`\`\n` +
                    `3. Add relevant emojis to enhance the message\n` +
                    `4. Use line breaks and spacing to make it readable\n` +
                    `5. Keep the core message but make it more engaging\n` +
                    `6. Never include markdown code blocks or backticks in the final output\n\n` +
                    `Message to format:\n${input}`
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
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to format with Google Gemini');
        }
        
        const data = await response.json();
        result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
      } else if (apiProvider === 'openrouter') {
        // Try OpenRouter first
        try {
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openRouterKey}`,
              'HTTP-Referer': 'http://localhost:3000',
              'X-Title': 'WhatsAppifiyer',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: MODEL_NAMES.openrouter,
              messages: [
                {
                  role: 'system',
                  content: 'You are a WhatsApp formatting expert. Format the following marketing message with perfect WhatsApp styling.\n\n' +
                  'RULES:\n' +
                  '1. ONLY return the final formatted message - NO explanations, thinking, or notes\n' +
                  '2. Use WhatsApp formatting: *bold*, _italic_, ~strikethrough~, ```monospace```\n' +
                  '3. Add relevant emojis to enhance the message\n' +
                  '4. Use line breaks and spacing to make it readable\n' +
                  '5. Keep the core message but make it more engaging\n' +
                  '6. Never include markdown code blocks or backticks in the final output\n\n' +
                  'Format the message to look exactly like a real WhatsApp message with proper spacing and line breaks.'
                },
                {
                  role: 'user',
                  content: input
                }
              ],
              temperature: 0.3,
              max_tokens: 1000
            })
          });

          if (!response.ok) {
            const error = await response.json();
            if (response.status === 429 || error.error?.type === 'insufficient_quota') {
              throw new Error('openrouter_quota_exceeded');
            }
            throw new Error(`API error: ${JSON.stringify(error)}`);
          }

          const data = await response.json();
          result = data.choices?.[0]?.message?.content || 'No response';
        } catch (error: any) {
          if (error.message === 'openrouter_quota_exceeded') {
            console.log('OpenRouter quota exceeded, falling back to Together AI');
            setApiProvider('together-deepseek');
            // Continue to Together AI fallback
          } else {
            throw error;
          }
        }
      }
      
      // Fallback to Together AI if OpenRouter fails or is not selected
      if (apiProvider.startsWith('together') || !result) {
        const model = apiProvider.startsWith('together') 
          ? MODEL_NAMES[apiProvider as keyof typeof MODEL_NAMES]
          : MODEL_NAMES['together-deepseek'];
          
        const response = await fetch('/api/together', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: `You are a WhatsApp formatting expert. Format the following marketing message with perfect WhatsApp styling.

RULES:
1. ONLY return the final formatted message - NO explanations, thinking, or notes
2. Use WhatsApp formatting: *bold*, _italic_, ~strikethrough~, \`\`\`monospace\`\`\`
3. Add relevant emojis to enhance the message
4. Use line breaks and spacing to make it readable
5. Keep the core message but make it more engaging
6. Use ONLY these formatting styles (NEVER use markdown):
   - *bold text* (single asterisks only, NEVER use **)
   - _italic text_ (single underscores only, NEVER use __)
   - ~strikethrough text~
   - \`\`\`monospace text\`\`\`
7. NEVER include any text outside the formatted message
8. Keep the message concise and to the point
9. NEVER use double asterisks (**) - always use single (*)
10. NEVER use double underscores (__) - always use single (_)`
              },
              {
                role: 'user',
                content: input
              }
            ],
            model
          })
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Together AI error: ${error}`);
        }

        const data = await response.json();
        // Clean up the response by removing <think> tags and their content
        result = (data.content || 'No response').replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      }
      
      // Clean up the output before setting it
      const cleanedOutput = formatForRawOutput(result);
      setOutput(cleanedOutput);
      setError('');
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage = error.message.includes('quota') 
        ? 'API quota exceeded. Please try again later or use a different provider.'
        : `Error: ${error.message}`;
      setError(errorMessage);
      setOutput('');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearForm = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">WhatsApp Message Formatter</h1>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setApiProvider('openrouter')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                apiProvider === 'openrouter' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              OpenRouter (DeepSeek 32B)
            </button>
            <button
              type="button"
              onClick={() => setApiProvider('together-llama')}
              className={`px-4 py-2 text-sm font-medium ${
                apiProvider === 'together-llama' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Together AI (Llama 3 70B)
            </button>
            <button
              type="button"
              onClick={() => setApiProvider('together-deepseek')}
              className={`px-4 py-2 text-sm font-medium ${
                apiProvider === 'together-deepseek' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Together AI (DeepSeek 70B)
            </button>
            <button
              type="button"
              onClick={() => setApiProvider('google-gemini')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                apiProvider === 'google-gemini' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Google Gemini 2.0 Flash
            </button>
          </div>
        </div>
        
        {apiProvider === 'google-gemini' && (
          <div className="mb-4">
            <label htmlFor="google-api-key" className="block text-sm font-medium text-gray-700 mb-1">
              Google API Key:
            </label>
            <input
              type="password"
              id="google-api-key"
              value={googleApiKey}
              onChange={(e) => setGoogleApiKey(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your Google API key"
            />
          </div>
        )}

        {apiProvider === 'openrouter' && (
          <div className="mb-4">
            <label htmlFor="openrouter-key" className="block text-sm font-medium text-gray-700 mb-1">
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

        <div className="mb-4 bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="input-text" className="block text-sm font-medium text-gray-700">
              Your Message
            </label>
            <div className="flex space-x-2">
              <button
                onClick={clearForm}
                disabled={!input && !output}
                className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                title="Clear"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <span className="text-xs text-gray-500 self-center">
                {input.length} characters
              </span>
            </div>
          </div>
          <div className="relative">
            <textarea
              id="input-text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto-expand the textarea
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 400)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
                  e.preventDefault();
                  callAI();
                }
              }}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px] max-h-[400px] resize-y"
              placeholder="Enter your message here..."
              rows={6}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={callAI}
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex-1 flex items-center justify-center transition-colors"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Formatting...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Format with {apiProvider === 'openrouter' ? 'OpenRouter' : apiProvider === 'google-gemini' ? 'Google Gemini' : 'Together AI'}
              </>
            )}
          </button>
          
          <button
            onClick={() => output && copyToClipboard(output)}
            disabled={!output || isLoading}
            className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Output Section */}
        <div className={`grid grid-cols-1 ${output ? 'md:grid-cols-2' : ''} gap-6 mt-4`}>
          {/* Left: Phone Preview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              WhatsApp Preview
            </h2>
            <div className="border rounded-lg p-4 bg-[#e5ddd5] min-h-40">
              {output ? (
                <div className="space-y-3">
                  {/* Sender's message */}
                  <div className="flex justify-end">
                    <div className="bg-[#d9fdd3] p-3 rounded-lg max-w-[85%] shadow-sm">
                      <div 
                        className="text-gray-800 break-words"
                        style={{ 
                          fontFamily: 'Segoe UI, system-ui, -apple-system, sans-serif',
                          lineHeight: '1.4',
                          fontSize: '14px'
                        }}
                        dangerouslySetInnerHTML={{ __html: formatForPreview(output) }}
                      />
                    </div>
                  </div>
                  
                  {/* Timestamp */}
                  <div className="flex justify-end pr-2">
                    <span className="text-[11px] text-gray-500 opacity-80">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="ml-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 15" className="text-gray-500 opacity-70">
                        <path fill="currentColor" d="M9.6 2.4H8V1.6a.4.4 0 0 0-.8 0v.8h-2V1.6a.4.4 0 0 0-.8 0v.8H2.4a.8.8 0 0 0-.8.8v9.6a.8.8 0 0 0 .8.8h7.2a.8.8 0 0 0 .8-.8V3.2a.8.8 0 0 0-.8-.8Z"/>
                        <path fill="currentColor" d="M6.4 8.8H5.6V8a.4.4 0 0 0-.8 0v.8H4a.4.4 0 0 0 0 .8h.8v.8a.4.4 0 0 0 .8 0v-.8H6a.4.4 0 0 0 0-.8h-.6Z"/>
                      </svg>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin h-4 w-4 mr-2 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Formatting...
                    </div>
                  ) : (
                    'Preview will appear here'
                  )}
                </div>
              )}
            </div>
          </div>

          {output && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Raw Output
              </h2>
              <div className="border rounded-lg p-4 bg-gray-50 min-h-40">
                <pre className="whitespace-pre-wrap font-mono text-sm overflow-x-auto">{output}</pre>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p className="font-medium">
            Currently using: <span className="font-semibold">
              {apiProvider === 'openrouter' 
                ? 'DeepSeek R1 Distill Qwen 32B via OpenRouter' 
                : apiProvider === 'together-llama'
                  ? 'Llama 3 70B via Together AI'
                  : apiProvider === 'google-gemini'
                    ? 'Gemini 2.0 Flash via Google AI'
                    : 'DeepSeek R1 Distill Llama 70B via Together AI'}
            </span>
          </p>
          {apiProvider === 'openrouter' && (
            <p className="text-xs text-yellow-600 mt-1">
              Note: Will automatically fall back to Together AI (DeepSeek 70B) if OpenRouter quota is exceeded
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
