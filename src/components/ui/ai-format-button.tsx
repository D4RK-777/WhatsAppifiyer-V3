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
    children = "Format with AI", 
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
          // Base styling
          "group relative overflow-hidden",
          "inline-flex items-center justify-center gap-2",
          "px-4 py-2 h-auto rounded-full",
          "bg-[#075E54] text-white",
          "hover:-translate-y-0.5 hover:shadow-md",
          "transition-all duration-250",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-ring focus-visible:ring-offset-2",
          // State variants
          "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none",
          className
        )}
        {...props}
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, #128C7E, #25D366, #128C7E) 0% 0% / 200% 100%',
              animation: 'gradientFlow 8s ease infinite',
              willChange: 'background-position',
              backfaceVisibility: 'hidden'
            }}
          >
            {/* Shimmer Effect */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent) 0% 0% / 200% 100%',
                animation: 'shimmer 3s ease infinite',
                mixBlendMode: 'overlay'
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />
          ) : (
            <div className="relative w-4 h-4 flex-shrink-0">
              <Sparkles
                className="w-full h-full text-white transition-all duration-250"
                style={{
                  animation: 'sizePulse 5s ease-in-out infinite',
                  transformOrigin: 'center center'
                }}
              />
            </div>
          )}
          {isLoading ? loadingText : children}
        </div>
      </button>
    )
  }
)

AIFormatButton.displayName = 'AIFormatButton'

export { AIFormatButton }
