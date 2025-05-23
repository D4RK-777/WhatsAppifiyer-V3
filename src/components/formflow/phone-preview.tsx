
"use client";

import React, { useState, useEffect } from 'react';
import { Wifi, BatteryFull, User, Phone, Video, MoreVertical, Smile, Paperclip, Mic, MessageCircle, Image as ImageIcon, FileText, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface PhonePreviewProps {
  messageText: string | undefined;
  contactName?: string;
  currentPhoneWidth?: number;
  zoomLevel?: number;
  mediaType?: 'standard' | 'image' | 'video' | 'pdf' | 'carousel' | 'catalog';
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
  mediaType = 'standard',
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
    <div className="flex justify-center items-start py-2 overflow-hidden">
      <div
        style={{ ...phoneStyle, width: '280px', height: '568px' }}
        className="aspect-[9/19.5] bg-zinc-800 p-2 rounded-[40px] shadow-2xl overflow-hidden max-w-full"
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
                <div className="relative pl-3">
                  <div className="absolute left-4 top-0 w-6 h-4 overflow-visible">
                    <div className="w-0 h-0 border-t-[12px] border-t-white border-r-[16px] border-r-transparent transform rotate-90 origin-top-left"></div>
                  </div>
                  <div className="relative w-full max-w-[90%] bg-white rounded-lg rounded-tl-none overflow-hidden shadow-sm">
                    
                    {/* Media Preview */}
                    {mediaType === 'image' && (
                      <div className="w-[calc(100%-4px)] h-32 bg-gray-100 flex items-center justify-center mx-0.5 my-0.5 rounded-md">
                        <ImageIcon size={32} className="text-gray-400" />
                      </div>
                    )}
                    {mediaType === 'video' && (
                      <div className="w-[calc(100%-4px)] h-32 bg-black flex items-center justify-center relative mx-0.5 my-0.5 rounded-md">
                        <Video size={32} className="text-white/80" />
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
                          1:23
                        </div>
                      </div>
                    )}
                    {mediaType === 'pdf' && (
                      <div className="p-3 border-b border-gray-100 flex items-center space-x-2">
                        <FileText size={20} className="text-red-500" />
                        <div className="text-xs">document.pdf</div>
                        <div className="text-[10px] text-gray-500 ml-auto">2.4 MB</div>
                      </div>
                    )}
                    {mediaType === 'carousel' && (
                      <div className="p-2 bg-gray-50 border-b border-gray-100">
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                          {[1, 2, 3].map((item) => (
                            <div key={item} className="flex-shrink-0 w-24 h-16 bg-gray-200 rounded flex items-center justify-center">
                              <ImageIcon size={20} className="text-gray-400" />
                            </div>
                          ))}
                        </div>
                        <div className="text-[10px] text-center text-gray-500 mt-1">Swipe to view more</div>
                      </div>
                    )}
                    {mediaType === 'catalog' && (
                      <div className="p-2 bg-gray-50 border-b border-gray-100">
                        <div className="flex items-center space-x-2">
                          <List size={16} className="text-gray-500" />
                          <span className="text-xs font-medium">Product Catalog</span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {[1, 2].map((item) => (
                            <div key={item} className="text-center">
                              <div className="w-full aspect-square bg-gray-200 rounded mb-1 flex items-center justify-center">
                                <ImageIcon size={16} className="text-gray-400" />
                              </div>
                              <div className="text-[10px] font-medium truncate">Product {item}</div>
                              <div className="text-[10px] text-green-600">$19.99</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Message Text */}
                    <div className="p-2">
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

