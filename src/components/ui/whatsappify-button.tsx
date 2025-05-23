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
    loadingText = "Processing...",
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          // Base styling
          "relative overflow-hidden",
          "inline-flex items-center justify-center gap-2",
          "px-6 py-3 h-auto rounded-lg text-sm font-bold",
          "transition-all duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none",
          
          // Gradient Raise style
          "bg-gradient-to-r from-[#25D366] to-[#F15F79]",
          "bg-size-200-auto",
          "text-white",
          "hover:bg-right-center hover:shadow-xl hover:-translate-y-1",
          "active:translate-y-0 active:shadow-lg",
          "disabled:hover:translate-y-0",
          
          className
        )}
        style={{
          backgroundSize: '200% auto',
          boxShadow: '0 4px 15px 0 rgba(111, 6, 25, 0.25)'
        }}
        {...props}
      >
        {/* Content */}
        <div className="relative flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 flex-shrink-0" />
          )}
          {isLoading ? loadingText : children}
        </div>
      </button>
    )
  }
)

WhatsAppifyButton.displayName = 'WhatsAppifyButton'

export { WhatsAppifyButton }
