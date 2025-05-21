"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormatButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  icon?: React.ReactNode
}

const FormatButton = React.forwardRef<HTMLButtonElement, FormatButtonProps>(
  ({ className, children, icon, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center whitespace-nowrap",
          "!rounded-full bg-[#c2fbd7] text-black hover:bg-[#075E54] hover:text-white border-0",
          
          // Shadow effects
          "shadow-[rgba(44,187,99,.2)_0_-25px_18px_-14px_inset,rgba(44,187,99,.15)_0_1px_2px,rgba(44,187,99,.15)_0_2px_4px,rgba(44,187,99,.15)_0_4px_8px,rgba(44,187,99,.15)_0_8px_16px,rgba(44,187,99,.15)_0_16px_32px]",
          
          // Hover effects
          "hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
          "hover:-translate-y-0.5",
          
          // Transitions & typography
          "transition-all duration-250",
          "font-semibold",
          "h-9",
          "px-3",
          "text-xs",
          "flex items-center",
          
          className
        )}
        {...props}
      >
        {icon && <span className="mr-1.5">{icon}</span>}
        {children}
      </button>
    )
  }
)

FormatButton.displayName = "FormatButton"

export { FormatButton }
