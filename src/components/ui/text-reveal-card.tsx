
"use client";
import React, { useEffect, useRef, useState, memo } from "react";
import { motion } from "framer-motion"; // Corrected import
import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";

export const TextRevealCard = ({
  text,
  revealText,
  children,
  className,
}: {
  text: string;
  revealText: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  const [widthPercentage, setWidthPercentage] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null); // Corrected type for ref
  const [left, setLeft] = useState(0);
  const [localWidth, setLocalWidth] = useState(0);
  const [isMouseOver, setIsMouseOver] = useState(false);

  useEffect(() => {
    if (cardRef.current) {
      const { left: currentLeft, width: currentWidth } = // Renamed to avoid conflict
        cardRef.current.getBoundingClientRect();
      setLeft(currentLeft);
      setLocalWidth(currentWidth);
    }
  }, []);

  function mouseMoveHandler(event: React.MouseEvent<HTMLDivElement>) { // Typed event
    event.preventDefault();

    const { clientX } = event;
    if (cardRef.current) {
      const relativeX = clientX - left;
      setWidthPercentage((relativeX / localWidth) * 100);
    }
  }

  function mouseLeaveHandler() {
    setIsMouseOver(false);
    setWidthPercentage(0);
  }
  function mouseEnterHandler() {
    setIsMouseOver(true);
  }
  function touchMoveHandler(event: React.TouchEvent<HTMLDivElement>) {
    event.preventDefault();
    const clientX = event.touches[0]!.clientX;
    if (cardRef.current) {
      const relativeX = clientX - left;
      setWidthPercentage((relativeX / localWidth) * 100);
    }
  }

  const rotateDeg = (widthPercentage - 50) * 0.1;
  return (
    <div
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      onMouseMove={mouseMoveHandler}
      onTouchStart={mouseEnterHandler}
      onTouchEnd={mouseLeaveHandler}
      onTouchMove={touchMoveHandler}
      ref={cardRef}
      className={cn(
        "bg-background w-full rounded-lg p-8 relative overflow-hidden", // Use theme background
        className
      )}
    >
      {children}

      <div className="h-32 relative flex items-center overflow-hidden">
        <motion.div
          style={{
            width: "100%",
          }}
          animate={
            isMouseOver
              ? {
                  opacity: widthPercentage > 0 ? 1 : 0,
                  clipPath: `inset(0 ${100 - widthPercentage}% 0 0)`,
                }
              : {
                  clipPath: `inset(0 ${100 - widthPercentage}% 0 0)`,
                }
          }
          transition={isMouseOver ? { duration: 0 } : { duration: 0.4 }}
          className="absolute bg-background z-20 will-change-transform" // Use theme background
        >
          <p
            style={{
              textShadow: "1px 1px 5px hsl(var(--primary) / 0.3)",
            }}
            className="text-base sm:text-xl md:text-2xl py-6 text-primary text-center whitespace-pre-line"
          >
            {revealText}
          </p>
        </motion.div>
        <motion.div
          animate={{
            left: `${widthPercentage}%`,
            rotate: `${rotateDeg}deg`,
            opacity: widthPercentage > 0 ? 1 : 0,
          }}
          transition={isMouseOver ? { duration: 0 } : { duration: 0.4 }}
          className="h-32 w-[8px] bg-gradient-to-b from-transparent via-border to-transparent absolute z-50 will-change-transform" // Use theme border
        ></motion.div>

        <div className="w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,white,transparent)] text-center">
          <p className="text-base sm:text-xl md:text-2xl py-6 font-normal text-muted-foreground/70 text-center whitespace-pre-line">
            {text}
          </p>
          <Stars />
        </div>
      </div>
    </div>
  );
};

export const TextRevealCardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2 className={twMerge("text-foreground text-lg mb-2", className)}> {/* Use theme foreground */}
      {children}
    </h2>
  );
};

export const TextRevealCardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={twMerge("text-muted-foreground text-sm", className)}> {/* Use theme muted-foreground */}
      {children}
    </p>
  );
};

const Stars = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Render nothing on the server or initial client pass before mount
  }

  // All random calls happen only on the client after mount
  const random = () => Math.random();
  const randomMove = () => Math.random() * 4 - 2;
  const randomOpacity = () => Math.random() * 0.7 + 0.1;

  return (
    <div className="absolute inset-0">
      {[...Array(60)].map((_, i) => (
        <motion.span
          key={`star-${i}`}
          initial={{ opacity: 0, scale: 0.5 }} // Start invisible and slightly smaller
          animate={{
            top: `calc(${random() * 100}% + ${randomMove()}px)`,
            left: `calc(${random() * 100}% + ${randomMove()}px)`,
            opacity: randomOpacity(),
            scale: [1, 1.2, 0],
          }}
          transition={{
            duration: random() * 10 + 20,
            repeat: Infinity,
            ease: "linear",
          }}
          // Static styles that don't depend on Math.random for initial render
          style={{
            position: "absolute",
            width: `1.5px`,
            height: `1.5px`,
            backgroundColor: "hsl(var(--foreground))", // Use theme foreground
            borderRadius: "50%",
            zIndex: 1,
          }}
          className="inline-block"
        />
      ))}
    </div>
  );
};
