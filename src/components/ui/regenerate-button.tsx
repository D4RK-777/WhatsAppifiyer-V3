"use client"

import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"
import { Loader2, Sparkles } from "lucide-react"

interface RegenerateButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
  variationNumber: number
}

const RegenerateButton = forwardRef<HTMLButtonElement, RegenerateButtonProps>(
  ({ 
    className, 
    children, 
    isLoading = false, 
    loadingText = "Regenerating...",
    variationNumber,
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        suppressHydrationWarning
        className={cn(
          // Base styles
          'whatsapp-button',
          'relative inline-flex items-center justify-center w-full',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075E54] focus-visible:ring-offset-2',
          // Loading state
          'overflow-hidden',
          className
        )}
        {...props}
      >
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#075E54] text-white rounded-full">
            <Loader2 className="h-4 w-4 animate-spin-smooth mr-2" />
            <span className="text-sm font-medium">{loadingText}</span>
          </div>
        )}
        
        {/* Content */}
        <div className={cn(
          'flex items-center justify-center gap-2 transition-opacity',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}>
          <Sparkles className="h-4 w-4 animate-sparkle-icon" />
          <span className="font-semibold">Regenerate Variation {variationNumber}</span>
        </div>
      </button>
    )
  }
)

RegenerateButton.displayName = 'RegenerateButton'

export { RegenerateButton }
