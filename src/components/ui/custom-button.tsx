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
          'h-9 px-3 text-xs font-semibold',
          'border-0 cursor-pointer !rounded-full',
          'bg-[#c2fbd7] text-black',
          'hover:bg-[#075E54] hover:text-white',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'shadow-[0_4px_9px_-1px_rgba(0,0,0,0.25),0_2px_4px_-1px_rgba(0,0,0,0.15)]',
          'shadow-[rgba(44,187,99,.35)_0_-25px_18px_-14px_inset]',
          'hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]',
          'active:shadow-[0_2px_4px_-1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.03)]',
          'transition-shadow duration-200 ease-in-out',
          'hover:-translate-y-0.5',
          'transition-all duration-250',
          'disabled:pointer-events-none disabled:opacity-50',
          '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
          active && 'bg-[#075E54] text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2),0_2px_4px_-1px_rgba(0,0,0,0.15)]',
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
