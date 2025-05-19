"use client";

/**
 * WhatsApp Style Button Component
 * 
 * A reusable button component that matches WhatsApp's styling with hover effects and animations.
 * 
 * Features:
 * - WhatsApp brand gradient (from #25D366 to #128C7E)
 * - Hover effects:
 *   - Gradient reverses direction
 *   - Subtle lift animation (-translate-y-0.5)
 *   - Enhanced shadow effect
 *   - Smooth transitions
 * - Focus states with ring styling
 * - Responsive text sizing
 * - Disabled state styling
 * - Includes a play icon from Lucide
 */

import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Play, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        whatsapp: "bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white shadow-[rgba(44,187,99,.2)_0_-25px_18px_-14px_inset,rgba(44,187,99,.15)_0_1px_2px,rgba(44,187,99,.15)_0_2px_4px,rgba(44,187,99,.15)_0_4px_8px,rgba(44,187,99,.15)_0_8px_16px,rgba(44,187,99,.15)_0_16px_32px] hover:bg-gradient-to-r hover:from-[#128C7E] hover:to-[#25D366] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
      },
      size: {
        default: "h-9 px-3 text-xs",
        sm: "h-8 px-2 text-xs",
        lg: "h-10 px-4 text-sm",
      },
    },
    defaultVariants: {
      variant: "whatsapp",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isActive?: boolean;
  ariaLabel?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  className, 
  variant, 
  size, 
  children,
  isActive = false,
  ariaLabel = "WhatsApp Button",
  ...props 
}, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

interface TutorialButtonProps {
  onClick: () => void;
  isActive?: boolean;
  ariaLabel?: string;
  className?: string;
  size?: "default" | "sm" | "lg";
}

/**
 * TutorialButton - A pixel-perfect WhatsApp-styled button for opening tutorials
 * Matches WhatsApp's design language with proper highlighting and hover effects
 */
const TutorialButton = ({
  onClick,
  isActive = false,
  ariaLabel = "Open WhatsApp formatting tutorial",
  className,
  size = "default",
}: TutorialButtonProps) => {
  return (
    <Button
      variant="whatsapp"
      size={size}
      onClick={onClick}
      isActive={isActive}
      ariaLabel={ariaLabel}
      className={className}
    >
      <Play className="mr-1.5" />
      Tutorial
    </Button>
  );
};

export { Button, buttonVariants };
export default TutorialButton;
