
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

    // Unescape \n into \n for consistent newline handling
    let text = inputText.replace(/\\n/g, '\n');
    
    // Process the text in a more linear way to better handle WhatsApp formatting
    // This approach processes the text line by line for better handling of lists and block elements
    // while still supporting inline formatting

    // Split the text into lines for processing
    const lines = text.split('\n');
    const result: React.ReactNode[] = [];
    
    let currentListType: null | 'bullet' | 'number' = null;
    let listItems: string[] = [];
    
    // Process each line
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      // Check for empty lines (paragraph breaks)
      if (line.trim() === '') {
        if (currentListType) {
          // End the current list if there is one
          if (currentListType === 'bullet') {
            result.push(
              <ul key={generateKey('bulletedlist')} className="list-disc pl-5 my-3 space-y-1.5">
                {listItems.map((item, idx) => (
                  <li key={`item-${idx}`}>{processInlineFormatting(item)}</li>
                ))}
              </ul>
            );
          } else {
            result.push(
              <ol key={generateKey('numberedlist')} className="list-decimal pl-5 my-3 space-y-1.5">
                {listItems.map((item, idx) => (
                  <li key={`item-${idx}`}>{processInlineFormatting(item)}</li>
                ))}
              </ol>
            );
          }
          currentListType = null;
          listItems = [];
        }
        
        // Add consistent paragraph spacing
        result.push(<div key={generateKey('break')} className="h-3"></div>);
        continue;
      }
      
      // Check for list items (asterisk, hyphen, or bullet character)
      const bulletMatch = line.match(/^[\*\-•]\s+(.+)$/);
      const numberMatch = line.match(/^(\d+)\.\s+(.+)$/);
      
      if (bulletMatch) {
        // Bullet list item
        if (currentListType && currentListType !== 'bullet') {
          // End the current numbered list
          result.push(
            <ol key={generateKey('numberedlist')} className="list-decimal pl-5 my-3 space-y-1.5">
              {listItems.map((item, idx) => (
                <li key={`item-${idx}`}>{processInlineFormatting(item)}</li>
              ))}
            </ol>
          );
          listItems = [];
        }
        
        currentListType = 'bullet';
        listItems.push(bulletMatch[1]);
      } else if (numberMatch) {
        // Numbered list item
        if (currentListType && currentListType !== 'number') {
          // End the current bullet list
          result.push(
            <ul key={generateKey('bulletedlist')} className="list-disc pl-5 my-3 space-y-1.5">
              {listItems.map((item, idx) => (
                <li key={`item-${idx}`}>{processInlineFormatting(item)}</li>
              ))}
            </ul>
          );
          listItems = [];
        }
        
        currentListType = 'number';
        listItems.push(numberMatch[2]);
      } else if (line.startsWith('> ')) {
        // Blockquote
        if (currentListType) {
          // End the current list if there is one
          if (currentListType === 'bullet') {
            result.push(
              <ul key={generateKey('bulletedlist')} className="list-disc pl-5 my-3 space-y-1.5">
                {listItems.map((item, idx) => (
                  <li key={`item-${idx}`}>{processInlineFormatting(item)}</li>
                ))}
              </ul>
            );
          } else {
            result.push(
              <ol key={generateKey('numberedlist')} className="list-decimal pl-5 my-3 space-y-1.5">
                {listItems.map((item, idx) => (
                  <li key={`item-${idx}`}>{processInlineFormatting(item)}</li>
                ))}
              </ol>
            );
          }
          currentListType = null;
          listItems = [];
        }
        
        const blockquoteContent = line.substring(2);
        result.push(
          <blockquote key={generateKey('blockquote')} className="border-l-4 border-neutral-400 dark:border-neutral-500 pl-3 py-2 my-3 italic text-neutral-700 dark:text-neutral-300">
            {processInlineFormatting(blockquoteContent)}
          </blockquote>
        );
      } else if (line.startsWith('```') && line.endsWith('```') && line.length > 6) {
        // Inline code block (single line)
        if (currentListType) {
          // End the current list if there is one
          if (currentListType === 'bullet') {
            result.push(
              <ul key={generateKey('bulletedlist')} className="list-disc pl-5 my-3 space-y-1.5">
                {listItems.map((item, idx) => (
                  <li key={`item-${idx}`}>{processInlineFormatting(item)}</li>
                ))}
              </ul>
            );
          } else {
            result.push(
              <ol key={generateKey('numberedlist')} className="list-decimal pl-5 my-3 space-y-1.5">
                {listItems.map((item, idx) => (
                  <li key={`item-${idx}`}>{processInlineFormatting(item)}</li>
                ))}
              </ol>
            );
          }
          currentListType = null;
          listItems = [];
        }
        
        const codeContent = line.substring(3, line.length - 3);
        result.push(
          <pre key={generateKey('codeblock')} className="bg-neutral-200 dark:bg-neutral-700 p-3 my-3 rounded-md text-xs font-mono whitespace-pre-wrap break-all">
            <code>{codeContent}</code>
          </pre>
        );
      } else {
        // Regular line with possible inline formatting
        if (currentListType) {
          // End the current list if there is one
          if (currentListType === 'bullet') {
            result.push(
              <ul key={generateKey('bulletedlist')} className="list-disc pl-5 my-3 space-y-1.5">
                {listItems.map((item, idx) => (
                  <li key={`item-${idx}`}>{processInlineFormatting(item)}</li>
                ))}
              </ul>
            );
          } else {
            result.push(
              <ol key={generateKey('numberedlist')} className="list-decimal pl-5 my-3 space-y-1.5">
                {listItems.map((item, idx) => (
                  <li key={`item-${idx}`}>{processInlineFormatting(item)}</li>
                ))}
              </ol>
            );
          }
          currentListType = null;
          listItems = [];
        }
        
        result.push(
          <div key={generateKey('line')} className="inline">
            {processInlineFormatting(line)}
          </div>
        );
      }
      
      // Only add line breaks if the current line is not empty and the next line is not empty
      if (i < lines.length - 1 && line.trim() !== '' && lines[i + 1].trim() !== '') {
        result.push(<br key={generateKey('linebreak')} />);
      }
    }
    
    // Handle any remaining list
    if (currentListType) {
      if (currentListType === 'bullet') {
        result.push(
          <ul key={generateKey('bulletedlist')} className="list-disc pl-5 my-3 space-y-1.5">
            {listItems.map((item, idx) => (
              <li key={`item-${idx}`}>{processInlineFormatting(item)}</li>
            ))}
          </ul>
        );
      } else {
        result.push(
          <ol key={generateKey('numberedlist')} className="list-decimal pl-5 my-3 space-y-1.5">
            {listItems.map((item, idx) => (
              <li key={`item-${idx}`}>{processInlineFormatting(item)}</li>
            ))}
          </ol>
        );
      }
    }
    
    return result;
  };
  
  // Helper function to process inline formatting (bold, italic, strikethrough, inline code)
  const processInlineFormatting = (text: string): React.ReactNode[] => {
    if (!text) return [];
    
    const segments: Array<{type: string, content: string | React.ReactNode[]}> = [{ type: 'text', content: text }];
    const result: React.ReactNode[] = [];
    
    // Process each formatting type in sequence
    // This approach handles formatting more reliably than recursive regex matching
    
    // Process monospace (```code```)
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (segment.type !== 'text') continue;
      
      const text = segment.content as string;
      const parts = [];
      let lastIndex = 0;
      
      // Find all monospace sections
      const monospaceRegex = /```([^`]+?)```/g;
      let match;
      
      while ((match = monospaceRegex.exec(text)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
        }
        
        // Add the monospace content
        parts.push({ type: 'monospace', content: match[1] });
        
        lastIndex = match.index + match[0].length;
      }
      
      // Add any remaining text
      if (lastIndex < text.length) {
        parts.push({ type: 'text', content: text.substring(lastIndex) });
      }
      
      // Replace the current segment with the processed parts
      segments.splice(i, 1, ...parts);
      i += parts.length - 1;
    }
    
    // Process inline code (`code`)
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (segment.type !== 'text') continue;
      
      const text = segment.content as string;
      const parts = [];
      let lastIndex = 0;
      
      // Find all inline code sections
      const inlineCodeRegex = /`([^`]+?)`/g;
      let match;
      
      while ((match = inlineCodeRegex.exec(text)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
        }
        
        // Add the inline code content
        parts.push({ type: 'inlinecode', content: match[1] });
        
        lastIndex = match.index + match[0].length;
      }
      
      // Add any remaining text
      if (lastIndex < text.length) {
        parts.push({ type: 'text', content: text.substring(lastIndex) });
      }
      
      // Replace the current segment with the processed parts
      segments.splice(i, 1, ...parts);
      i += parts.length - 1;
    }
    
    // Process bold (*bold*)
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (segment.type !== 'text') continue;
      
      const text = segment.content as string;
      const parts = [];
      let lastIndex = 0;
      
      // Find all bold sections - WhatsApp uses single asterisks for bold text
      const boldRegex = /\*([^*]+?)\*/g;
      let match;
      
      while ((match = boldRegex.exec(text)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
        }
        
        // Add the bold content
        parts.push({ type: 'bold', content: match[1] });
        
        lastIndex = match.index + match[0].length;
      }
      
      // Add any remaining text
      if (lastIndex < text.length) {
        parts.push({ type: 'text', content: text.substring(lastIndex) });
      }
      
      // Replace the current segment with the processed parts
      segments.splice(i, 1, ...parts);
      i += parts.length - 1;
    }
    
    // Process italic (_italic_)
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (segment.type !== 'text') continue;
      
      const text = segment.content as string;
      const parts = [];
      let lastIndex = 0;
      
      // Find all italic sections - WhatsApp uses single underscores for italic text
      const italicRegex = /_([^_]+?)_/g;
      let match;
      
      while ((match = italicRegex.exec(text)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
        }
        
        // Add the italic content
        parts.push({ type: 'italic', content: match[1] });
        
        lastIndex = match.index + match[0].length;
      }
      
      // Add any remaining text
      if (lastIndex < text.length) {
        parts.push({ type: 'text', content: text.substring(lastIndex) });
      }
      
      // Replace the current segment with the processed parts
      segments.splice(i, 1, ...parts);
      i += parts.length - 1;
    }
    
    // Process strikethrough (~strike~)
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (segment.type !== 'text') continue;
      
      const text = segment.content as string;
      const parts = [];
      let lastIndex = 0;
      
      // Find all strikethrough sections - WhatsApp uses single tildes for strikethrough text
      const strikeRegex = /~([^~]+?)~/g;
      let match;
      
      while ((match = strikeRegex.exec(text)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
        }
        
        // Add the strikethrough content
        parts.push({ type: 'strike', content: match[1] });
        
        lastIndex = match.index + match[0].length;
      }
      
      // Add any remaining text
      if (lastIndex < text.length) {
        parts.push({ type: 'text', content: text.substring(lastIndex) });
      }
      
      // Replace the current segment with the processed parts
      segments.splice(i, 1, ...parts);
      i += parts.length - 1;
    }
    
    // Convert segments to React nodes
    for (const segment of segments) {
      switch (segment.type) {
        case 'text':
          result.push(<span key={generateKey('text')}>{segment.content as string}</span>);
          break;
        case 'bold':
          result.push(<strong key={generateKey('bold')}>{segment.content as string}</strong>);
          break;
        case 'italic':
          result.push(<em key={generateKey('italic')}>{segment.content as string}</em>);
          break;
        case 'strike':
          result.push(<del key={generateKey('strike')}>{segment.content as string}</del>);
          break;
        case 'inlinecode':
          result.push(
            <code key={generateKey('inlinecode')} className="bg-neutral-200 dark:bg-neutral-700 px-1 py-0.5 rounded text-xs font-mono">
              {segment.content as string}
            </code>
          );
          break;
        case 'monospace':
          result.push(
            <pre key={generateKey('monospace')} className="bg-neutral-200 dark:bg-neutral-700 p-2 my-2 rounded-md text-xs font-mono whitespace-pre-wrap break-all inline-block w-full">
              <code>{segment.content as string}</code>
            </pre>
          );
          break;
      }
    }
    
    return result;
  };
  
  // First ensure all double newlines are preserved as paragraph breaks
  const formattedText = (messageText || '').replace(/\n\s*\n/g, '\n\n');
  const formattedNodes = parseTextToReact(formattedText);

  return (
    <div className="w-full flex mb-2">
      <div className={cn(
        "relative max-w-[80%] p-2 rounded-lg shadow whitespace-pre-wrap", 
        isSender 
          ? "bg-[#E9FDC9] dark:bg-[#55752F] ml-auto rounded-br-none" 
          : "bg-white dark:bg-neutral-700 mr-auto rounded-bl-none"
      )}>
        {/* Message content */}
        <div 
          className={cn(
            "text-sm text-black dark:text-white leading-relaxed break-words",
            isSender ? "pr-4" : "pl-4"
          )}
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {formattedNodes}
        </div>
        
        {/* Timestamp */}
        <div className={cn(
          "text-[11px] mt-0.5 flex items-center justify-end gap-1",
          isSender 
            ? "text-[#667781] dark:text-neutral-300" 
            : "text-[#667781] dark:text-neutral-300"
        )}>
          {timestamp}
          {isSender && (
            <span className="inline-block text-[#53bdeb] ml-1">
              ✓✓
            </span>
          )}
        </div>
        
        {/* Tail */}
        {isSender ? (
          <div className="absolute -right-[6px] bottom-0 w-3 h-3 overflow-hidden">
            <div className="absolute -left-[6px] bottom-0 w-3 h-3 bg-[#E9FDC9] dark:bg-[#55752F] transform -rotate-45 origin-bottom-left"></div>
          </div>
        ) : (
          <div className="absolute -left-[6px] bottom-0 w-3 h-3 overflow-hidden">
            <div className="absolute -right-[6px] bottom-0 w-3 h-3 bg-white dark:bg-neutral-700 transform rotate-45 origin-bottom-right"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppMessageBubble;
