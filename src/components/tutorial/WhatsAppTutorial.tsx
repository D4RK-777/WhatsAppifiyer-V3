"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, TextCursorInput, Target, MessageSquareText, Gift, CheckCircle } from 'lucide-react';
import Tutorial from './Tutorial';
import TutorialButton from './TutorialButton';
import { TutorialStep } from './types';

// Storage key for tracking if the tutorial has been seen
const TUTORIAL_STORAGE_KEY = 'whatsappifyTutorialSeen_v2';

// Define the tutorial steps
const tutorialSteps: TutorialStep[] = [
  {
    target: 'body', // First step is centered
    title: "Welcome to WhatsAppify!",
    content: "Let's quickly show you how to transform your text into engaging WhatsApp messages.",
    position: 'center',
    icon: Sparkles,
    disableBeacon: true
  },
  {
    target: "#tour-target-input-area",
    title: "1. Your Text or Idea",
    content: "Paste your existing SMS, plain text, or simply type an idea for a message in the main text area.",
    position: 'bottom',
    icon: TextCursorInput
  },
  {
    target: "#tour-target-message-type",
    title: "2. Select Message Type",
    content: "Choose the type of WhatsApp message you want to create (e.g., Marketing, Utility, etc.). This helps the AI tailor the tone and style.",
    position: 'top',
    icon: Target
  },
  {
    target: "#tour-target-transform-button",
    title: "3. Transform Your Text",
    content: "Click the 'WhatsAppify Into Something Spectacular' button. Our AI will then generate three distinct WhatsApp message variations for you.",
    position: 'bottom',
    icon: Sparkles
  },
  {
    target: "#tour-target-variations-area",
    title: "4. Review Variations & Copy",
    content: "You'll see three phone previews, each showing a different AI-generated variation. Use the 'Regenerate Variation' button to get new options, or 'Copy Variation' to get the WhatsApp-ready text.",
    position: 'right',
    icon: MessageSquareText
  },
  {
    target: "#tour-target-template-gallery-container",
    title: "5. Explore Templates",
    content: "Need inspiration or a quick start? Browse our template gallery. Click any template to pre-fill the form with its content and message type.",
    position: 'top',
    icon: Gift
  },
  {
    target: 'body',
    title: "You're All Set!",
    content: "Enjoy creating perfectly formatted WhatsApp messages with our AI-powered tool!",
    position: 'center',
    icon: CheckCircle
  }
];

interface WhatsAppTutorialProps {
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * WhatsApp Tutorial Component
 * Enhanced tutorial experience for the WhatsAppify application
 */
const WhatsAppTutorial: React.FC<WhatsAppTutorialProps> = ({ isOpen: externalIsOpen, onClose }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = (value: boolean) => {
    if (externalIsOpen !== undefined && !value && onClose) {
      // If we're controlled externally and closing, call onClose
      onClose();
    } else {
      // Otherwise use internal state
      setInternalIsOpen(value);
    }
  };
  const [isClient, setIsClient] = useState(false);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if tutorial should be shown automatically on first visit
  useEffect(() => {
    if (isClient && externalIsOpen === undefined) {
      // Only auto-open if we're not controlled externally
      const hasCompletedTutorial = localStorage.getItem(TUTORIAL_STORAGE_KEY) === 'completed';
      if (!hasCompletedTutorial) {
        setInternalIsOpen(true);
      }
    }
  }, [isClient, externalIsOpen]);

  // Handle tutorial completion
  const handleComplete = () => {
    if (isClient) {
      localStorage.setItem(TUTORIAL_STORAGE_KEY, 'completed');
    }
  };

  // Handle tutorial close
  const handleClose = () => {
    setIsOpen(false);
    if (isClient) {
      localStorage.setItem(TUTORIAL_STORAGE_KEY, 'dismissed');
    }
  };
  
  // Handle tutorial open
  const handleOpen = () => {
    setIsOpen(true);
  };

  // Don't render anything on server
  if (!isClient) {
    return null;
  }

  return (
    <>
      <Tutorial
        steps={tutorialSteps}
        isOpen={isOpen}
        onClose={handleClose}
        onComplete={handleComplete}
        storageKey={TUTORIAL_STORAGE_KEY}
      />
      <TutorialButton 
        onClick={handleOpen}
        isActive={isOpen}
        ariaLabel="Open WhatsApp formatting tutorial"
      />
    </>
  );
};

export default WhatsAppTutorial;
