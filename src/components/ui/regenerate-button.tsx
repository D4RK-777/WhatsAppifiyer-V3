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
          'inline-flex items-center justify-center',
          'whitespace-nowrap font-bold transition-all duration-300',
          'text-white z-1 uppercase relative text-sm',
          'bg-gradient-to-r from-[#25D366] via-[#25D366] to-[#128C7E]',
          'bg-[length:200%_auto] rounded-full',
          'hover:bg-[position:right_center] hover:translate-y-[-0.25em]',
          'hover:shadow-[0_10px_9px_-3px_rgba(37,211,102,0.38)]',
          'active:translate-y-0 active:shadow-none',
          'px-[22px] py-[11.8px] h-[37.6px]',
          'focus-visible:outline-none',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      >
        {/* Content */}
        <div className="relative flex items-center">
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#075E54] text-white rounded-full">
              <Loader2 className="h-4 w-4 animate-spin-smooth mr-2" />
              <span className="text-sm font-medium">{loadingText}</span>
            </div>
          )}
          
          <div className={cn(
            'flex items-center gap-2 transition-opacity',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}>
            <Sparkles className="h-4 w-4 animate-sparkle-icon" />
            <span className="font-semibold">Regenerate</span>
          </div>
        </div>
      </button>
    )
  }
)

RegenerateButton.displayName = 'RegenerateButton'

export { RegenerateButton }
