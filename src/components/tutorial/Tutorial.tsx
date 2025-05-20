"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { TutorialProps, TutorialStep } from './types';
import { createPortal } from 'react-dom';

/**
 * Enhanced Tutorial component for step-by-step interactive walkthroughs
 * 
 * Features:
 * - Tooltip-style popovers that highlight specific UI elements
 * - Smooth transitions between steps
 * - Back/Next navigation
 * - Progress indicator
 * - Skip option
 * - Keyboard navigation support (left/right arrows, Esc to skip)
 * - Responsive design
 * - Accessibility support
 */
const Tutorial: React.FC<TutorialProps> = ({
  steps,
  isOpen,
  onClose,
  onComplete,
  storageKey,
  initialStep = 0
}) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep); // State for current step
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 }); // State for tooltip position
  const [tooltipDirection, setTooltipDirection] = useState<'top' | 'right' | 'bottom' | 'left' | 'center'>('bottom');
  const [isClient, setIsClient] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  
  const tooltipRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Setup client-side rendering
  useEffect(() => {
    setIsClient(true);
    const container = document.createElement('div');
    container.id = 'tutorial-portal';
    document.body.appendChild(container);
    setPortalContainer(container);
    
    return () => {
      if (container && document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, []);
  

  
  // Calculate tooltip position based on target element
  const calculatePosition = useCallback(() => {
    if (!isClient || !isOpen || currentStep === null) return;

    // Clear any previous highlight
    const previousHighlights = document.querySelectorAll('.tutorial-highlight');
    previousHighlights.forEach(el => {
      el.classList.remove('tutorial-highlight');
      el.classList.remove('tutorial-highlight-pulse');
    });

    // Handle center position for intro/outro steps
    if (steps[currentStep].position === 'center') {
      setTooltipDirection('center');
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const tooltipWidth = 380; // Approximate width of tooltip
      const tooltipHeight = 220; // Approximate height of tooltip
      
      setTooltipPosition({
        top: (viewportHeight - tooltipHeight) / 2,
        left: (viewportWidth - tooltipWidth) / 2
      });
      return;
    }

    const targetElement = document.getElementById(steps[currentStep].target);
    if (!targetElement) return;
    
    // Add highlight to current target element
    targetElement.classList.add('tutorial-highlight');
    targetElement.classList.add('tutorial-highlight-pulse');

    // Scroll the element into view if it's not visible
    const targetRect = targetElement.getBoundingClientRect();
    const isInViewport = (
      targetRect.top >= 0 &&
      targetRect.left >= 0 &&
      targetRect.bottom <= window.innerHeight &&
      targetRect.right <= window.innerWidth
    );

    if (!isInViewport) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Wait a bit for scrolling to complete before calculating position
      setTimeout(() => calculatePosition(), 500);
      return;
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Default position is 'bottom'
    let position = steps[currentStep].position || 'bottom';
    // Fallback for center if target is specified
    if (position === 'center' as 'top' | 'right' | 'bottom' | 'left' | 'center') {
      position = 'bottom';
    }
    
    // Calculate if there's enough space for the tooltip in the specified position
    // If not, try to find a better position
    const tooltipWidth = 320; // Approximate width of tooltip
    const tooltipHeight = 180; // Approximate height of tooltip
    const arrowSize = 10; // Size of the arrow
    const margin = 15; // Margin from the element
    
    const spaceTop = targetRect.top;
    const spaceBottom = viewportHeight - targetRect.bottom;
    const spaceLeft = targetRect.left;
    const spaceRight = viewportWidth - targetRect.right;
    
    if (position === 'bottom' && spaceBottom < tooltipHeight + margin) {
      position = spaceTop > tooltipHeight + margin ? 'top' : (spaceRight > tooltipWidth + margin ? 'right' : 'left');
    } else if (position === 'top' && spaceTop < tooltipHeight + margin) {
      position = spaceBottom > tooltipHeight + margin ? 'bottom' : (spaceRight > tooltipWidth + margin ? 'right' : 'left');
    } else if (position === 'left' && spaceLeft < tooltipWidth + margin) {
      position = spaceRight > tooltipWidth + margin ? 'right' : (spaceBottom > tooltipHeight + margin ? 'bottom' : 'top');
    } else if (position === 'right' && spaceRight < tooltipWidth + margin) {
      position = spaceLeft > tooltipWidth + margin ? 'left' : (spaceBottom > tooltipHeight + margin ? 'bottom' : 'top');
    }
    
    // Apply any offset
    const offset = typeof steps[currentStep].offset === 'number' 
      ? { x: 0, y: steps[currentStep].offset as number } 
      : (steps[currentStep].offset as { x: number, y: number } | undefined) || { x: 0, y: 0 };
    
    setTooltipDirection(position as 'top' | 'right' | 'bottom' | 'left' | 'center');
    
    // Calculate position based on the target element and position
    let top = 0;
    let left = 0;
    
    switch (position) {
      case 'top':
        top = targetRect.top - tooltipHeight - arrowSize + offset.y;
        left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2) + offset.x;
        break;
      case 'bottom':
        top = targetRect.bottom + arrowSize + offset.y;
        left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2) + offset.x;
        break;
      case 'left':
        top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2) + offset.y;
        left = targetRect.left - tooltipWidth - arrowSize + offset.x;
        break;
      case 'right':
        top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2) + offset.y;
        left = targetRect.right + arrowSize + offset.x;
        break;
    }
    
    // Ensure tooltip stays within viewport bounds
    top = Math.max(10, Math.min(viewportHeight - tooltipHeight - 10, top));
    left = Math.max(10, Math.min(viewportWidth - tooltipWidth - 10, left));
    
    setTooltipPosition({ top, left });
  }, [isClient, isOpen, currentStep, steps]);
  
  // Position tooltip when step changes or window resizes
  useEffect(() => {
    if (!isClient || !isOpen) return;
    
    calculatePosition();
    
    const handleResize = debounce(calculatePosition, 100);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isClient, isOpen, currentStep, calculatePosition]);
  
  // Navigation handlers
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    // Clear any highlights when skipping the tutorial
    const highlights = document.querySelectorAll('.tutorial-highlight');
    highlights.forEach(el => {
      el.classList.remove('tutorial-highlight');
      el.classList.remove('tutorial-highlight-pulse');
    });
    
    onClose();
  };
  
  const handleComplete = () => {
    // Clear any highlights when completing the tutorial
    const highlights = document.querySelectorAll('.tutorial-highlight');
    highlights.forEach(el => {
      el.classList.remove('tutorial-highlight');
      el.classList.remove('tutorial-highlight-pulse');
    });
    
    onClose();
    onComplete?.();
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          handleSkip();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrevious, handleSkip]);

  // Utility function for debouncing
  function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function(this: any, ...args: any[]) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  
  // Don't render anything on server or when closed
  if (!isClient || !isOpen || !portalContainer) {
    return null;
  }
  
  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  
  // Render the tutorial
  return createPortal(
    <>
      {/* Semi-transparent overlay */}
      <div 
        ref={overlayRef}
        className="tutorial-overlay"
        onClick={handleSkip}
        role="presentation"
      />
      
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={`tutorial-tooltip ${tooltipDirection === 'center' ? 'tutorial-tooltip-center' : ''}`}
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-title"
      >
        {/* Close button */}
        <button 
          className="tutorial-close-button"
          onClick={handleSkip}
          aria-label="Close tutorial"
        >
          <X size={18} />
        </button>
        
        {/* Arrow - only show if not centered */}
        {tooltipDirection !== 'center' && (
          <div className={`tutorial-tooltip-arrow tutorial-tooltip-arrow-${tooltipDirection}`}></div>
        )}
        
        {/* Content */}
        <div className="tutorial-content">
          {/* Icon if available */}
          {step.icon && (
            <div className="tutorial-icon">
              {React.createElement(step.icon, { size: 24 })}
            </div>
          )}
          <h3 id="tutorial-title" className="tutorial-title">{step.title}</h3>
          <div className="tutorial-body">{step.content}</div>
        </div>
        
        {/* Progress indicator */}
        <div className="tutorial-progress">
          {steps.map((_, index) => (
            <button
              key={index}
              className={`tutorial-progress-dot ${index === currentStep ? 'active' : ''}`}
              onClick={() => setCurrentStep(index)}
              aria-label={`Go to step ${index + 1}`}
              aria-current={index === currentStep ? 'step' : undefined}
            />
          ))}
        </div>
        
        {/* Navigation buttons */}
        <div className="tutorial-navigation">
          {isFirstStep ? (
            <button 
              className="tutorial-button tutorial-button-skip"
              onClick={handleSkip}
            >
              Skip
            </button>
          ) : (
            <button 
              className="tutorial-button tutorial-button-prev"
              onClick={handlePrevious}
            >
              <ChevronLeft size={16} /> Previous
            </button>
          )}
          
          <button 
            className="tutorial-button tutorial-button-next"
            onClick={handleNext}
          >
            {isLastStep ? (
              <>Finish <Check size={16} /></>
            ) : (
              <>Next <ChevronRight size={16} /></>
            )}
          </button>
        </div>
      </div>
    </>,
    portalContainer
  );
};

export default Tutorial;
