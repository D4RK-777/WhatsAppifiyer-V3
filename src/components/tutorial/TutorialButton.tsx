"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TutorialButtonProps {
  onClick: () => void;
  isActive?: boolean;
  ariaLabel?: string;
  className?: string;
}

/**
 * TutorialButton - A pixel-perfect floating button for opening tutorials
 * Matches WhatsApp's design language with proper highlighting and hover effects
 */
const TutorialButton = ({
  onClick,
  isActive = false,
  ariaLabel = "Open WhatsApp formatting tutorial",
  className,
}: TutorialButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Pulse animation for the active state
  const pulseAnimation = {
    boxShadow: [
      "0 0 0 0 rgba(37, 211, 102, 0)",
      "0 0 0 8px rgba(37, 211, 102, 0.3)",
      "0 0 0 0 rgba(37, 211, 102, 0)"
    ]
  };

  return (
    <div className={cn("relative", className)}>
      {/* Tooltip that appears on hover */}
      {isHovered && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1.5 rounded-md shadow-md text-sm font-medium text-gray-800 whitespace-nowrap z-10"
        >
          {ariaLabel}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
        </motion.div>
      )}
      
      {/* Main button */}
      <motion.button
        className={cn(
          "w-10 h-10 rounded-full bg-[#075E54] border-2 border-white flex items-center justify-center",
          isActive && "ring-2 ring-[#25D366] ring-opacity-70"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isActive ? {
          ...pulseAnimation,
          transition: { duration: 2, repeat: Infinity }
        } : {}}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={ariaLabel}
        suppressHydrationWarning
      >
        <HelpCircle className="w-5 h-5 text-white" />
      </motion.button>
    </div>
  );
};

export default TutorialButton;
