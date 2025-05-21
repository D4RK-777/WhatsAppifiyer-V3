'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SimpleMessageBubbleProps {
  messageText: string | undefined;
  isSender?: boolean;
  timestamp?: string;
}

const SimpleMessageBubble: React.FC<SimpleMessageBubbleProps> = ({
  messageText = '',
  isSender = true,
  timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
}) => {
  // Process the message text to handle basic formatting
  const processMessage = (text: string): React.ReactNode[] => {
    if (!text) return [];
    
    // Split by double newlines to handle paragraphs
    const paragraphs = text.split(/\n\s*\n/);
    
    return paragraphs.map((paragraph, pIndex) => {
      if (!paragraph.trim()) return null;
      
      // Process inline formatting within each paragraph
      const elements: React.ReactNode[] = [];
      let remaining = paragraph;
      
      // Process bold, italic, strikethrough, and code
      const parts = [];
      
      // Split by formatting markers, preserving the markers
      const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__|_[^_]+_|~~[^~]+~~|`[^`]+`)/g;
      let match;
      let lastIndex = 0;
      
      while ((match = regex.exec(paragraph)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          parts.push({ type: 'text', content: paragraph.substring(lastIndex, match.index) });
        }
        
        // Add the formatted content
        const content = match[0];
        if (content.startsWith('**') && content.endsWith('**')) {
          parts.push({ type: 'bold', content: content.slice(2, -2) });
        } else if (content.startsWith('*') && content.endsWith('*')) {
          parts.push({ type: 'italic', content: content.slice(1, -1) });
        } else if (content.startsWith('__') && content.endsWith('__')) {
          parts.push({ type: 'bold', content: content.slice(2, -2) });
        } else if (content.startsWith('_') && content.endsWith('_')) {
          parts.push({ type: 'italic', content: content.slice(1, -1) });
        } else if (content.startsWith('~~') && content.endsWith('~~')) {
          parts.push({ type: 'strike', content: content.slice(2, -2) });
        } else if (content.startsWith('`') && content.endsWith('`')) {
          parts.push({ type: 'code', content: content.slice(1, -1) });
        } else {
          parts.push({ type: 'text', content });
        }
        
        lastIndex = match.index + match[0].length;
      }
      
      // Add any remaining text
      if (lastIndex < paragraph.length) {
        parts.push({ type: 'text', content: paragraph.substring(lastIndex) });
      }
      
      // Convert parts to React elements
      const paragraphContent = parts.map((part, i) => {
        switch (part.type) {
          case 'bold':
            return <strong key={i} className="font-bold">{part.content}</strong>;
          case 'italic':
            return <em key={i} className="italic">{part.content}</em>;
          case 'strike':
            return <del key={i} className="line-through">{part.content}</del>;
          case 'code':
            return <code key={i} className="bg-gray-200 dark:bg-gray-700 px-1 rounded font-mono text-sm">{part.content}</code>;
          default:
            return <span key={i}>{part.content}</span>;
        }
      });
      
      return (
        <p key={pIndex} className="mb-2 last:mb-0">
          {paragraphContent}
        </p>
      );
    }).filter(Boolean) as React.ReactNode[];
  };

  return (
    <div className="w-full flex mb-2">
      <div
        className={cn(
          "max-w-[80%] p-3 rounded-lg shadow",
          isSender 
            ? "bg-[#E9FDC9] dark:bg-[#55752F] ml-auto rounded-br-none" 
            : "bg-white dark:bg-neutral-700 mr-auto rounded-bl-none"
        )}
      >
        <div className="text-sm text-gray-800 dark:text-gray-100 leading-relaxed">
          {processMessage(messageText)}
        </div>
        <div className={cn(
          "text-xs mt-1",
          isSender 
            ? "text-right text-gray-500 dark:text-gray-300" 
            : "text-left text-gray-500 dark:text-gray-300"
        )}>
          {timestamp}
        </div>
      </div>
    </div>
  );
};

export default SimpleMessageBubble;
