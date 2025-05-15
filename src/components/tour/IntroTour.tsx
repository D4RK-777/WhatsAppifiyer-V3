
"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, Gift, MessageSquareText, Sparkles, Target, TextCursorInput } from 'lucide-react';

const TOUR_STORAGE_KEY = 'whatsappifyIntroTourSeen_v1';

interface TourStep {
  title: string;
  description: React.ReactNode;
  icon?: React.ElementType;
  targetId?: string; 
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to WhatsAppify!",
    description: "Let's quickly show you how to transform your text into engaging WhatsApp messages.",
    icon: Sparkles,
  },
  {
    title: "1. Your Text or Idea",
    description: "Paste your existing SMS, plain text, or simply type an idea for a message in the main text area.",
    icon: TextCursorInput,
    targetId: "tour-target-input-area",
  },
  {
    title: "2. Select Message Type",
    description: "Choose the type of WhatsApp message you want to create (e.g., Marketing, Utility, etc.). This helps the AI tailor the tone and style.",
    icon: Target,
    targetId: "tour-target-message-type",
  },
  {
    title: "3. Transform Your Text",
    description: "Click the 'Transform text into something magical' button. Our AI will then generate three distinct WhatsApp message variations for you.",
    icon: Sparkles,
    targetId: "tour-target-transform-button-container",
  },
  {
    title: "4. Review Variations & Copy",
    description: "You'll see three phone previews, each showing a different AI-generated variation. Click a preview to select it, then use the 'Copy Variation' button to get the WhatsApp-ready text.",
    icon: MessageSquareText,
    targetId: "tour-target-variations-area",
  },
  {
    title: "5. Explore Templates",
    description: "Need inspiration or a quick start? Browse our template gallery. Click any template to pre-fill the form with its content and message type.",
    icon: Gift,
    targetId: "tour-target-template-gallery-container",
  },
  {
    title: "You're All Set!",
    description: "Enjoy creating perfectly formatted WhatsApp messages!",
    icon: CheckCircle,
  },
];

const IntroTour: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const highlightedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setIsClient(true); 
  }, []);

  useEffect(() => {
    if (isClient) {
      const tourSeen = localStorage.getItem(TOUR_STORAGE_KEY);
      if (tourSeen !== 'true') {
        setIsOpen(true);
      }
    }
  }, [isClient]);

  useEffect(() => {
    const currentTargetId = tourSteps[currentStep]?.targetId;

    // Cleanup previous highlight
    if (highlightedElementRef.current) {
      highlightedElementRef.current.classList.remove('tour-step-highlight');
      highlightedElementRef.current = null;
    }

    if (isOpen && isClient && currentTargetId) {
      const element = document.getElementById(currentTargetId);
      if (element) {
        setTimeout(() => { // Ensure dialog is rendered before scrolling/highlighting
          element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
          element.classList.add('tour-step-highlight');
          highlightedElementRef.current = element;
        }, 150); // Increased delay slightly
      }
    }

    // Cleanup on tour close or step change without target
    if (!isOpen || !currentTargetId) {
        if (highlightedElementRef.current) {
            highlightedElementRef.current.classList.remove('tour-step-highlight');
            highlightedElementRef.current = null;
        }
    }
  }, [currentStep, isOpen, isClient]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinishOrSkip = () => {
    setIsOpen(false);
    if (highlightedElementRef.current) {
        highlightedElementRef.current.classList.remove('tour-step-highlight');
        highlightedElementRef.current = null;
    }
    if (isClient) {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    }
  };

  const handleFinish = () => {
    // setCurrentStep to the last step to ensure cleanup effect runs if needed, then close
    setCurrentStep(tourSteps.length - 1); 
    handleFinishOrSkip();
  };
  
  const handleSkip = () => {
    handleFinishOrSkip();
  };

  if (!isClient || !isOpen) {
    return null;
  }

  const CurrentIcon = tourSteps[currentStep].icon;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleSkip(); 
      }
      // setIsOpen(open); // Let the skip/finish handlers manage isOpen
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          {CurrentIcon && <CurrentIcon className="h-12 w-12 text-primary mb-3" />}
          <DialogTitle className="text-2xl">{tourSteps[currentStep].title}</DialogTitle>
          <DialogDescription className="text-center text-sm px-2 py-3">
            {tourSteps[currentStep].description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center items-center space-x-1 mt-2 mb-3">
            {tourSteps.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ease-in-out
                        ${currentStep === index ? 'bg-primary scale-125' : 'bg-muted hover:bg-muted-foreground/50'}
                    `}
                    aria-label={`Go to step ${index + 1}`}
                />
            ))}
        </div>

        <DialogFooter className="sm:justify-between gap-2 mt-4">
          {currentStep > 0 ? (
            <Button variant="outline" onClick={handlePrevious} className="gap-1">
              <ArrowLeft size={16} /> Previous
            </Button>
          ) : (
            <Button variant="ghost" onClick={handleSkip}>Skip Tour</Button>
          )}

          {currentStep < tourSteps.length - 1 ? (
            <Button onClick={handleNext} className="gap-1">
              Next <ArrowRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleFinish} className="gap-1">
              Finish <CheckCircle size={16} />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IntroTour;
