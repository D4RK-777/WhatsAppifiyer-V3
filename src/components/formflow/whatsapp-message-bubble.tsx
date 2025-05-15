
"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface WhatsAppMessageBubbleProps {
  messageText: string | undefined;
  isSender?: boolean;
  timestamp?: string;
}

const WhatsAppMessageBubble: React.FC<WhatsAppMessageBubbleProps> = ({
  messageText,
  isSender = true,
  timestamp = "10:00 AM",
}) => {
  let keyCounter = 0;
  // Using a simpler key generation strategy, consider a more robust one if components are frequently reordered.
  const generateKey = (type: string) => `${type}-${keyCounter++}`;

  const parseTextToReact = (inputText: string): React.ReactNode[] => {
    if (!inputText) return [];

    // Unescape \\n into \n for consistent newline handling
    let text = inputText.replace(/\\n/g, '\n');

    // 1. ```codeblock``` (multiline, non-greedy)
    const codeMatch = text.match(/^(.*?)```([\s\S]*?)```(.*)$/s);
    if (codeMatch) {
      return [
        ...(codeMatch[1] ? parseTextToReact(codeMatch[1]) : []),
        <pre key={generateKey('codeblock')} className="bg-neutral-200 dark:bg-neutral-700 p-2 my-1 rounded-md text-xs font-mono whitespace-pre-wrap break-all">
          <code>{codeMatch[2]}</code>
        </pre>,
        ...(codeMatch[3] ? parseTextToReact(codeMatch[3]) : [])
      ];
    }
    
    // 2. *bold* (non-greedy, content must exist)
    // Ensure we don't match if it's part of a larger word like_this* or *this_
    // Regex: (anything)(*non-whitespace-or-*-char some-content non-whitespace-or-*-char*)(anything)
    const boldMatch = text.match(/^(.*?)(\*(?!\s)((?:[^*]|\*(?=\s))+?)(?<!\s)\*)(.*)$/s);
    if (boldMatch) {
      return [
        ...(boldMatch[1] ? parseTextToReact(boldMatch[1]) : []),
        <strong key={generateKey('bold')}>{parseTextToReact(boldMatch[3])}</strong>,
        ...(boldMatch[4] ? parseTextToReact(boldMatch[4]) : [])
      ];
    }

    // 3. _italic_ (non-greedy, content must exist)
    // Regex: (anything)(_non-whitespace-or-_-char some-content non-whitespace-or-_-char_)(anything)
    const italicMatch = text.match(/^(.*?)(\_(?!\s)((?:[^_]|\_(?=\s))+?)(?<!\s)\_)(.*)$/s);
    if (italicMatch) {
      return [
        ...(italicMatch[1] ? parseTextToReact(italicMatch[1]) : []),
        <em key={generateKey('italic')}>{parseTextToReact(italicMatch[3])}</em>,
        ...(italicMatch[4] ? parseTextToReact(italicMatch[4]) : [])
      ];
    }
    
    // 4. ~strikethrough~ (non-greedy, content must exist)
    // Regex: (anything)(~non-whitespace-or-~-char some-content non-whitespace-or-~-char~)(anything)
    const strikeMatch = text.match(/^(.*?)(\~(?!\s)((?:[^~]|\~(?=\s))+?)(?<!\s)\~)(.*)$/s);
    if (strikeMatch) {
      return [
        ...(strikeMatch[1] ? parseTextToReact(strikeMatch[1]) : []),
        <del key={generateKey('strike')}>{parseTextToReact(strikeMatch[3])}</del>,
        ...(strikeMatch[4] ? parseTextToReact(strikeMatch[4]) : [])
      ];
    }

    // 5. Newlines and plain text
    // Replace literal \n with <br /> tags for display
    return text.split(/(\n)/g).map((part, index) => {
      if (part === '\n') return <br key={generateKey(`br-${index}`)} />;
      if (part) return <span key={generateKey(`text-${index}`)}>{part}</span>; 
      return null;
    }).filter(Boolean);
  };
  
  const formattedNodes = parseTextToReact(messageText || '');

  return (
    <div className="w-full flex mb-2">
      <div
        className={cn(
          "max-w-[80%] p-2 rounded-lg shadow", // Increased max-width from 75% to 80%
          isSender ? "bg-[#E9FDC9] dark:bg-[#55752F] ml-auto rounded-br-none" : "bg-card dark:bg-neutral-700 mr-auto rounded-bl-none"
        )}
      >
        <div className={cn(
            "text-xs text-black dark:text-white leading-relaxed break-words whitespace-pre-line" // Changed text-sm to text-xs
          )}
        >
          {formattedNodes}
        </div>
        <div className={cn(
          "text-xs mt-1", // Timestamp text size also text-xs
          isSender ? "text-right text-neutral-500 dark:text-neutral-400" : "text-left text-neutral-500 dark:text-neutral-400"
        )}>
          {timestamp}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppMessageBubble;
