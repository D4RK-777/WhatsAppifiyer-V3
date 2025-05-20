import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Base styles for all gradient buttons
const gradientButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[12px] text-sm font-bold transition-all duration-300 cursor-pointer text-white z-1 px-[22px] py-[18px] m-[15px] uppercase relative",
  {
    variants: {
      variant: {
        // Gradient 01 - Shrinking border with gradient fill
        gradient1: [
          "bg-transparent",
          "before:content-[''] before:block before:absolute before:h-full before:w-full before:top-0 before:left-0 before:z-[-2] before:bg-[#7a00ff33] before:rounded-[12px]",
          "after:content-[''] after:block after:absolute after:rounded-[10px] after:bg-gradient-to-tr after:from-[#ff6209] after:to-[#6905d5] after:bottom-[4px] after:left-[4px] after:right-[4px] after:top-[4px] after:z-[-1] after:transition-all after:duration-100 after:ease-out",
          "hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:top-0 hover:after:transition-timing-function-ease-in",
          "active:after:bg-[linear-gradient(0deg,rgba(0,0,0,.2),rgba(0,0,0,.2)),linear-gradient(45deg,#ff7426_0,#f93a13_100%)] active:after:bottom-[4px] active:after:left-[4px] active:after:right-[4px] active:after:top-[4px]",
        ],
        // Gradient 02 - Wide gradient with position change on hover
        gradient2: [
          "bg-gradient-to-r from-[#009245] via-[#FCEE21] via-[#00A8C5] to-[#D9E021] bg-[length:350%_100%]",
          "hover:bg-[position:100%_0]",
        ],
        // Gradient 03 - Shadow on hover
        gradient3: [
          "bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#1FA2FF] bg-[length:200%_auto]",
          "hover:bg-[position:right_center] hover:shadow-[0_4px_15px_0_#12d8fa]",
        ],
        // Gradient 04 - Raise on hover
        gradient4: [
          "bg-gradient-to-r from-[#B24592] via-[#F15F79] to-[#B24592] bg-[length:200%_auto]",
          "hover:bg-[position:right_center] hover:translate-y-[-0.25em] hover:shadow-[0_10px_9px_-3px_#6f061961]",
          "active:translate-y-0 active:shadow-none",
        ],
        // Gradient 05 - Slide up
        gradient5: [
          "bg-gradient-to-r from-[#25aae1] to-[#40e495] shadow-[0_4px_15px_0_rgba(49,196,190,0.75)] overflow-hidden",
          "after:content-[''] after:absolute after:w-full after:h-0 after:top-0 after:left-0 after:z-[-1] after:rounded-[12px] after:bg-gradient-to-r after:from-[#CDDC39] after:to-[#8BC34A] after:transition-all after:duration-300 after:ease-[ease]",
          "hover:after:top-auto hover:after:bottom-0 hover:after:h-full",
          "active:shadow-none",
        ],
        // Gradient 06 - Slide right
        gradient6: [
          "bg-gradient-to-r from-[#F7971E] to-[#FFD200] shadow-[0_4px_15px_0_#F7971E66] overflow-hidden",
          "after:content-[''] after:absolute after:w-0 after:h-full after:top-0 after:right-0 after:z-[-1] after:rounded-[12px] after:bg-gradient-to-r after:from-[#feb47b] after:to-[#ff7e5f] after:transition-all after:duration-300 after:ease-[ease]",
          "hover:after:left-0 hover:after:right-auto hover:after:w-full",
          "active:shadow-none",
        ],
        // Gradient 07 - Slide down
        gradient7: [
          "bg-white shadow-[0px_6px_16px_0px_#8d7bb187] overflow-hidden text-[#5f6095]",
          "after:content-[''] after:absolute after:w-full after:h-full after:bottom-0 after:left-0 after:z-[-1] after:rounded-[12px] after:bg-gradient-to-r after:from-[#70e1f5] after:to-[#ffd194] after:transition-all after:duration-300 after:ease-[ease]",
          "hover:text-[#5f6095] hover:after:h-[5px]",
          "active:shadow-[0px_4px_8px_0px_#8d7bb187]",
        ],
        // Gradient 08 - Infinity gradient
        gradient8: [
          "before:content-[''] before:absolute before:top-0 before:left-0 before:bg-[linear-gradient(225deg,#ff0000,#ff7300,#fffb00,#48ff00,#00ffd5,#002bff,#7a00ff,#ff00c8,#ff0000)] before:bg-[length:400%] before:z-[-1] before:w-full before:h-full before:transition-opacity before:duration-300 before:ease-in-out before:rounded-[12px]",
          "hover:before:animate-[glowing_20s_linear_infinite]",
          "active:before:bg-[#000137]",
        ],
        // Gradient 09 - Border 01
        gradient9: [
          "bg-[linear-gradient(144deg,#AF40FF,#5B42F3_50%,#00DDEB)] shadow-[rgba(151,65,252,0.2)_0_15px_30px_-5px]",
          "after:content-[''] after:absolute after:bg-[#000137] after:rounded-[8px] after:w-[calc(100%-8px)] after:h-[calc(100%-8px)] after:top-[4px] after:left-[4px] after:z-[-1] after:transition-opacity after:duration-300 after:ease-in-out",
          "hover:after:opacity-0",
          "active:after:opacity-100",
        ],
        // Gradient 10 - Border 02
        gradient10: [
          "bg-[linear-gradient(144deg,#AF40FF,#5B42F3_50%,#00DDEB)] shadow-[rgba(151,65,252,0.2)_0_15px_30px_-5px]",
          "after:content-[''] after:absolute after:bg-[#000137] after:rounded-[8px] after:w-[calc(100%-8px)] after:h-[calc(100%-8px)] after:top-[4px] after:left-[4px] after:z-[-1] after:transition-opacity after:duration-300 after:ease-in-out after:opacity-0",
          "hover:after:opacity-100",
          "active:after:opacity-0",
        ],
        // Gradient 11 - Text 01
        gradient11: [
          "bg-gradient-to-r from-[#16BFFD] via-[#CB3066] to-[#16BFFD] bg-[length:200%_auto] shadow-[0px_6px_16px_0px_#8d7bb187] bg-clip-text text-transparent",
          "hover:bg-[position:right_center] hover:bg-clip-border hover:text-white",
        ],
        // Gradient 12 - Text 02
        gradient12: [
          "bg-gradient-to-r from-[#16BFFD] via-[#CB3066] to-[#16BFFD] bg-[length:200%_auto] shadow-[0px_6px_16px_0px_#8d7bb187]",
          "hover:bg-[position:right_center] hover:bg-clip-text hover:text-transparent",
          "active:bg-clip-border active:text-white",
        ],
      },
      size: {
        default: "text-sm",
        sm: "text-xs px-[15px] py-[12px]",
        lg: "text-base px-[25px] py-[20px]",
      },
    },
    defaultVariants: {
      variant: "gradient1",
      size: "default",
    },
  }
);

// Define the keyframes for the glowing animation
const glowingKeyframes = `
@keyframes glowing {
  0% { background-position: 0 0; }
  50% { background-position: 400% 0; }
  100% { background-position: 0 0; }
}
`;

export interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gradientButtonVariants> {
  asChild?: boolean;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Add the keyframes to the document head
    React.useEffect(() => {
      if (!document.getElementById("gradient-button-keyframes")) {
        const style = document.createElement("style");
        style.id = "gradient-button-keyframes";
        style.innerHTML = glowingKeyframes;
        document.head.appendChild(style);
        return () => {
          document.head.removeChild(style);
        };
      }
    }, []);

    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(gradientButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
GradientButton.displayName = "GradientButton";

export { GradientButton, gradientButtonVariants };
