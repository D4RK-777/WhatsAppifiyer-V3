
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
  const generateKey = (type: string) => `${type}-${Date.now()}-${keyCounter++}`;

  const parseTextToReact = (text: string): React.ReactNode[] => {
    if (!text) return [];

    // 1. ```codeblock``` (multiline, non-greedy)
    // Need to handle this first as it can contain other markdown chars
    const codeMatch = text.match(/^(.*?)```([\s\S]*?)```(.*)$/s);
    if (codeMatch) {
      return [
        ...parseTextToReact(codeMatch[1]),
        <pre key={generateKey('codeblock')} className="bg-neutral-200 dark:bg-neutral-700 p-2 my-1 rounded-md text-xs font-mono whitespace-pre-wrap break-all">
          <code>{codeMatch[2]}</code>
        </pre>,
        ...parseTextToReact(codeMatch[3])
      ];
    }
    
    // 2. *bold* (non-greedy, content must exist)
    const boldMatch = text.match(/^(.*?)\*([^*]+?)\*(.*)$/s);
    if (boldMatch) {
      return [
        ...parseTextToReact(boldMatch[1]),
        <strong key={generateKey('bold')}>{parseTextToReact(boldMatch[2])}</strong>,
        ...parseTextToReact(boldMatch[3])
      ];
    }

    // 3. _italic_ (non-greedy, content must exist)
    const italicMatch = text.match(/^(.*?)_([^_]+?)_(.*)$/s);
    if (italicMatch) {
      return [
        ...parseTextToReact(italicMatch[1]),
        <em key={generateKey('italic')}>{parseTextToReact(italicMatch[2])}</em>,
        ...parseTextToReact(italicMatch[3])
      ];
    }
    
    // 4. ~strikethrough~ (non-greedy, content must exist)
    const strikeMatch = text.match(/^(.*?)~([^~]+?)~(.*)$/s);
    if (strikeMatch) {
      return [
        ...parseTextToReact(strikeMatch[1]),
        <del key={generateKey('strike')}>{parseTextToReact(strikeMatch[2])}</del>,
        ...parseTextToReact(strikeMatch[3])
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
          "max-w-[75%] p-2 rounded-lg shadow",
          isSender ? "bg-[#E9FDC9] dark:bg-[#55752F] ml-auto rounded-br-none" : "bg-card dark:bg-neutral-700 mr-auto rounded-bl-none"
        )}
      >
        <div className={cn("text-sm text-black dark:text-white leading-snug break-words")}>
          {formattedNodes}
        </div>
        <div className={cn(
          "text-xs mt-1",
          isSender ? "text-right text-neutral-500 dark:text-neutral-400" : "text-left text-neutral-500 dark:text-neutral-400"
        )}>
          {timestamp}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppMessageBubble;
