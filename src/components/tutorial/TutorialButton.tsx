"use client";

/**
 * WhatsApp Style Tutorial Button Component
 * 
 * A reusable button component that matches WhatsApp's styling with hover effects and animations.
 * 
 * Features:
 * - WhatsApp green color (#25D366)
 * - Hover effects:
 *   - Background changes to WhatsApp green
 *   - Text changes to white
 *   - Subtle lift animation (-translate-y-0.5)
 * - Focus states with ring styling
 * - Disabled state styling
 * - Includes a play icon
 * - Rounded full design with border
 */

import React from "react";
import { cn } from "@/lib/utils";

export interface TutorialButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  isActive?: boolean;
  ariaLabel?: string;
}

/**
 * TutorialButton - A pixel-perfect WhatsApp-styled button for opening tutorials
 * Matches WhatsApp's design language with proper highlighting and hover effects
 */
const TutorialButton = React.forwardRef<HTMLButtonElement, TutorialButtonProps>(
  ({ 
    className, 
    children, 
    onClick,
    isActive = false,
    ariaLabel = "Open WhatsApp formatting tutorial",
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center whitespace-nowrap",
          "rounded-full bg-white text-[#25D366] border-2 border-[#25D366]",
          
          // Hover states
          "hover:bg-[#25D366] hover:text-white hover:-translate-y-0.5",
          
          // Focus states
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          
          // Disabled state
          "disabled:pointer-events-none disabled:opacity-50",
          
          // Transitions
          "transition-all duration-250",
          
          // Typography
          "font-semibold",
          
          // Sizing
          "h-9 px-3 text-xs flex items-center",
          
          className
        )}
        onClick={onClick}
        aria-label={ariaLabel}
        {...props}
      >
        <span className="flex items-center justify-center h-full">
          {/* Play icon */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-1.5"
          >
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          {children || 'Tutorial'}
        </span>
      </button>
    );
  }
);

TutorialButton.displayName = "TutorialButton";

export default TutorialButton;
