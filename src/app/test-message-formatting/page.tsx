'use client';

import React, { useState } from 'react';
import WhatsAppMessageBubble from '@/components/formflow/whatsapp-message-bubble';
import SimpleMessageBubble from '@/components/formflow/simple-message-bubble';

export default function TestMessageFormatting() {
  const [input, setInput] = useState(
    '*Hello!* 👋\n\n' +
    'Here\'s a test message with _formatting_.\n\n' +
    '*Key Points:*\n' +
    '• First point\n' +
    '• Second point\n\n' +
    'Let me know if you have any questions!'
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Message Formatting Test</h1>
      
      <div className="mb-6">
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message Text:
        </label>
        <textarea
          id="message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-40 p-2 border rounded"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Original Implementation</h2>
          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <WhatsAppMessageBubble messageText={input} isSender={false} />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Simplified Implementation</h2>
          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <SimpleMessageBubble messageText={input} isSender={false} />
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded">
        <h3 className="font-bold mb-2">Formatting Tips:</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Use <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">*bold*</code> for bold text</li>
          <li>Use <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">_italics_</code> for italic text</li>
          <li>Use <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">~strikethrough~</code> for strikethrough</li>
          <li>Use <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">`code`</code> for inline code</li>
          <li>Use two newlines for paragraph breaks</li>
        </ul>
      </div>
    </div>
  );
}
