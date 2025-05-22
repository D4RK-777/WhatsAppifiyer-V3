
"use client";

import React, { useState, useEffect } from 'react';
import { Wifi, BatteryFull, User, Phone, Video, MoreVertical, Smile, Paperclip, Mic, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface PhonePreviewProps {
  messageText: string | undefined;
  contactName?: string;
  currentPhoneWidth?: number;
  zoomLevel?: number;
}

// Function to format WhatsApp message text with proper HTML
const formatWhatsAppMessage = (text: string): string => {
  if (!text) return '';
  
  // Convert WhatsApp markdown to HTML
  let html = text
    // Convert *bold* to <strong>bold</strong> (WhatsApp uses single asterisks for bold)
    .replace(/\*([^*]+?)\*/g, '<strong>$1</strong>')
    // Convert _italic_ to <em>italic</em> (WhatsApp uses single underscores for italic)
    .replace(/_([^_]+?)_/g, '<em>$1</em>')
    // Convert ~strikethrough~ to <s>strikethrough</s>
    .replace(/~([^~]+?)~/g, '<s>$1</s>')
    // Convert `code` to <code>code</code> (inline code)
    .replace(/`([^`]+?)`/g, '<code style="background-color: #f0f0f0; padding: 1px 3px; border-radius: 3px; font-family: monospace;">$1</code>')
    // Convert URLs to clickable links
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" style="color: #0366d6; text-decoration: underline;">$1</a>')
    // Convert line breaks to <br> for proper spacing
    .replace(/\n/g, '<br>');
  
  return html;
};

const PhonePreview: React.FC<PhonePreviewProps> = ({
  messageText,
  contactName = "Chat Inc.",
  currentPhoneWidth = 280,
  zoomLevel = 1.0,
}) => {
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateClock(); 
    const timerId = setInterval(updateClock, 1000 * 60); // Update every minute, not every second.
    return () => clearInterval(timerId);
  }, []);

  const phoneStyle: React.CSSProperties = {
    width: `${currentPhoneWidth}px`,
    transform: `scale(${zoomLevel})`,
    transformOrigin: 'top center',
  };

  return (
    <div className="flex justify-center items-start py-2">
      <div
        style={{ ...phoneStyle, width: '280px', height: '568px' }}
        className="aspect-[9/19.5] bg-zinc-800 p-2 rounded-[40px] shadow-2xl overflow-hidden"
      >
        <div className="h-full w-full bg-background rounded-[32px] flex flex-col overflow-hidden">
          {/* Status Bar */}
          <div className="px-3 pt-2 pb-1 flex justify-between items-center text-xs text-foreground/80 shrink-0">
            {currentTime === null ? (
                <Skeleton className="h-4 w-10" />
              ) : (
                <span className="font-medium">{currentTime}</span>
            )}
            <div className="flex items-center space-x-1">
              <Wifi size={14} />
              <span className="text-xs">4G</span>
              <BatteryFull size={14} />
            </div>
          </div>

          {/* WhatsApp Business Header */}
          <div 
            className="px-3 py-2 flex items-center space-x-3 text-primary-foreground shrink-0"
            style={{ backgroundColor: '#075E54' }}
          >
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
              <img 
                src="/images/chat-inc-logo-white.png" 
                alt="Chat Inc. Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <div className="font-semibold text-[12px] leading-[14px] text-white">{contactName}</div>
              <div className="text-[10px] text-white/80">Business Account</div>
            </div>
            <div className="flex items-center space-x-3">
              <Video size={16} className="text-white/90 hover:text-white" />
              <Phone size={16} className="text-white/90 hover:text-white" />
              <MoreVertical size={16} className="text-white/90 hover:text-white" />
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-grow overflow-y-auto p-3 scrollbar-hide" style={{ 
            backgroundImage: 'url(/whatsapp-bg.jpg)', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}>
            {messageText && messageText.trim() !== "" ? (
              <div className="space-y-2">
                {/* Received Message (Business) */}
                <div className="flex justify-start">
                  <div className="relative max-w-[90%] bg-white rounded-lg rounded-tl-none p-2 shadow-sm">
                    {/* Message Tail */}
                    <div className="absolute left-0 top-0 w-3 h-3 overflow-hidden -translate-x-[1px]">
                      <div className="absolute w-3 h-3 bg-white origin-bottom-left rotate-45 -translate-y-1 -translate-x-1"></div>
                    </div>
                    <div 
                      className="text-[12px] leading-[14px] text-zinc-800 whitespace-pre-wrap break-words"
                      dangerouslySetInnerHTML={{ 
                        __html: formatWhatsAppMessage(messageText) 
                      }}
                    />
                    <div className="flex justify-end items-center mt-1 space-x-1">
                      <span className="text-[11px] text-zinc-500">10:00 AM</span>
                    </div>
                  </div>
                </div>
                
                {/* Sent Message (User) */}
                <div className="flex justify-end">
                  <div className="relative max-w-[90%] bg-[#DCF8C6] rounded-lg rounded-tr-none p-2 shadow-sm">
                    {/* Message Tail */}
                    <div className="absolute right-0 bottom-0 w-3 h-3 overflow-hidden translate-x-[1px]">
                      <div className="absolute w-3 h-3 bg-[#DCF8C6] origin-bottom-right -rotate-45 -translate-y-1 translate-x-1"></div>
                    </div>
                    <div 
                      className="text-[12px] leading-[14px] text-zinc-800 whitespace-pre-wrap break-words"
                      dangerouslySetInnerHTML={{ 
                        __html: formatWhatsAppMessage(messageText) 
                      }}
                    />
                    <div className="flex justify-end items-center mt-1 space-x-1">
                      <span className="text-[11px] text-zinc-500">10:01 AM</span>
                      <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.5 1L4.16667 8.33333L1.5 5.66667" stroke="#53BDEB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14.5 1L7.16667 8.33333L6.5 7.66667" stroke="#53BDEB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground text-xs p-4">
                <MessageCircle size={32} className="mb-2 opacity-50" />
                Your AI-generated WhatsApp message variation will appear here.
              </div>
            )}
          </div>

          {/* Mock Message Input Area */}
          <div className="bg-secondary p-2 border-t border-border shrink-0">
            <div className="bg-background rounded-full px-3 py-1.5 flex items-center space-x-2">
              <Smile size={20} className="text-muted-foreground" />
              <span className="text-muted-foreground text-[12px] leading-[14px] flex-grow">Type a message...</span>
              <Paperclip size={20} className="text-muted-foreground -rotate-45" />
              <Mic size={20} className="text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhonePreview;

