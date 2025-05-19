"use client"

import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  icon?: React.ReactNode
  active?: boolean
}

const CustomButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = '', icon, active = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap',
          'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
          'shadow-md !rounded-full bg-[#c2fbd7] text-black hover:bg-[#075E54] hover:text-white border-0',
          'shadow-[rgba(44,187,99,.2)_0_-25px_18px_-14px_inset,rgba(44,187,99,.15)_0_1px_2px,rgba(44,187,99,.15)_0_2px_4px,rgba(44,187,99,.15)_0_4px_8px,rgba(44,187,99,.15)_0_8px_16px,rgba(44,187,99,.15)_0_16px_32px]',
          'hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-0.5',
          'transition-all duration-250 font-semibold h-9 px-3 text-xs',
          active && 'bg-[#075E54] text-white',
          className
        )}
        {...props}
      >
        {icon && <span className="flex items-center">{icon}</span>}
        {children}
      </button>
    )
  }
)

CustomButton.displayName = 'CustomButton'

export { CustomButton }
