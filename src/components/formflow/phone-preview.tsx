
"use client";

import React, { useState, useEffect } from 'react';
import { Wifi, BatteryFull, User, Phone, Video, MoreVertical, Smile, Paperclip, Mic, MessageCircle } from 'lucide-react';
import WhatsAppMessageBubble from './whatsapp-message-bubble';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface PhonePreviewProps {
  messageText: string | undefined;
  contactName?: string;
  currentPhoneWidth?: number;
  zoomLevel?: number;
}

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
    const timerId = setInterval(updateClock, 1000 * 60); 
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
        style={phoneStyle}
        className="aspect-[9/19.5] bg-zinc-800 p-1.5 rounded-[40px] shadow-2xl overflow-hidden" // Removed border-4 border-zinc-900
      >
        <div className="h-full w-full bg-background rounded-[30px] flex flex-col overflow-hidden">
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
          <div className="bg-primary px-3 py-2 flex items-center space-x-3 text-primary-foreground shrink-0">
            <div className="p-1.5 bg-primary-foreground/20 rounded-full">
              <User size={20} className="text-primary-foreground" />
            </div>
            <div className="flex-grow">
              <div className="font-semibold text-sm">{contactName}</div>
              <div className="text-xs text-primary-foreground/80">Business Account</div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone size={18} />
              <Video size={18} />
              <MoreVertical size={18} />
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-grow overflow-y-auto p-3 bg-muted">
            {messageText && messageText.trim() !== "" ? (
              <WhatsAppMessageBubble messageText={messageText} isSender={true} timestamp="10:00 AM" />
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
              <span className="text-muted-foreground text-sm flex-grow">Type a message...</span>
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
