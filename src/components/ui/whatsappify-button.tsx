"use client"

import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"
import { Loader2, Sparkles } from "lucide-react"
import { GradientButton } from "./gradient-button"

interface WhatsAppifyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
}

// Custom styles for WhatsApp green gradient rise button
const whatsAppGradientStyles = {
  base: "bg-gradient-to-r from-[#25D366] via-[#25D366] to-[#128C7E] bg-[length:200%_auto] rounded-full",
  hover: "hover:bg-[position:right_center] hover:translate-y-[-0.25em] hover:shadow-[0_10px_9px_-3px_rgba(37,211,102,0.38)]",
  active: "active:translate-y-0 active:shadow-none",
};

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
      <GradientButton
        ref={ref}
        disabled={isLoading || disabled}
        variant="gradient4"
        className={cn(
          // Override the default gradient4 colors with WhatsApp green
          whatsAppGradientStyles.base,
          whatsAppGradientStyles.hover,
          whatsAppGradientStyles.active,
          className
        )}
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
      </GradientButton>
    )
  }
)

WhatsAppifyButton.displayName = 'WhatsAppifyButton'

export { WhatsAppifyButton }
