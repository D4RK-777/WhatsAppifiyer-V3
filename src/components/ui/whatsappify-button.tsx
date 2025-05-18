"use client"

import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"
import { Loader2, Sparkles } from "lucide-react"

interface WhatsAppifyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
}

const WhatsAppifyButton = forwardRef<HTMLButtonElement, WhatsAppifyButtonProps>(
  ({ 
    className, 
    children = "WhatsAppify", 
    isLoading = false, 
    loadingText = "Formatting...",
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
          'relative inline-flex items-center justify-center',
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
          <span className="font-semibold">{children}</span>
        </div>
      </button>
    )
  }
)

WhatsAppifyButton.displayName = 'WhatsAppifyButton'

export { WhatsAppifyButton }
