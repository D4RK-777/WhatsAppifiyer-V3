"use client"

import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"
import { Loader2, Sparkles } from "lucide-react"

interface AIFormatButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
}

const AIFormatButton = forwardRef<HTMLButtonElement, AIFormatButtonProps>(
  ({ 
    className, 
    children = "Format", 
    isLoading = false, 
    loadingText = "Formatting...",
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          // Base styles from button-33 class
          'button-33',
          // Additional Tailwind classes for layout
          'inline-flex items-center justify-center',
          'h-9 min-w-[120px]',
          'text-sm font-medium',
          'font-sans',
          // State variants
          'disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center">
            <Loader2 className="mr-1 h-3 w-3 animate-spin-smooth" />
            {loadingText}
          </span>
        ) : (
          <span className="flex items-center animate-sparkle-icon">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            {children}
          </span>
        )}
      </button>
    )
  }
)

AIFormatButton.displayName = 'AIFormatButton'

export { AIFormatButton }
