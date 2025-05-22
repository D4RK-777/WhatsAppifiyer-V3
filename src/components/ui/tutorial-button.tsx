'use client';

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TutorialButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  children?: React.ReactNode
  videoSrc?: string
  'aria-label'?: string
}

const TutorialButton = React.forwardRef<HTMLButtonElement, TutorialButtonProps>(
  ({ className, children, videoSrc, ...props }, ref) => {
    const [showVideo, setShowVideo] = React.useState(false);
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setShowVideo(true);
      if (props.onClick) {
        props.onClick(e);
      }
    };
    
    const handleCloseVideo = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowVideo(false);
    };
    
    const handleModalClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleCloseVideo(e);
      }
    };
    
    return (
      <>
        <button
          ref={ref}
          className={cn(
            "tutorial-button",
            "inline-flex items-center justify-center whitespace-nowrap",
            "rounded-full bg-white text-[#25D366] border-2 border-[#25D366]",
            "hover:bg-[#25D366] hover:text-white hover:-translate-y-0.5",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            "transition-all duration-250 font-semibold h-9 px-3 text-xs",
            className
          )}
          {...props}
          onClick={handleClick}
        >
          <span className="tutorial-button-content flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="tutorial-button-icon mr-1.5"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            {children || 'Tutorial'}
          </span>
        </button>
        
        {videoSrc && showVideo && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={handleModalClick}
          >
            <div className="relative w-full h-full max-w-5xl max-h-[80vh] bg-black rounded-lg overflow-hidden">
              {videoSrc.includes('loom.com') ? (
                <iframe
                  src={videoSrc.replace('share', 'embed')}
                  frameBorder="0"
                  allowFullScreen
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              ) : (
                <video
                  src={videoSrc}
                  className="w-full h-full object-contain"
                  autoPlay
                  controls
                  loop
                />
              )}
              <button 
                className="absolute top-4 right-4 text-white bg-[#25D366] hover:bg-[#128C7E] rounded-full p-2 transition-colors duration-200"
                onClick={handleCloseVideo}
                aria-label="Close tutorial"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        )}
      </>
    )
  }
)

TutorialButton.displayName = "TutorialButton"

export { TutorialButton }
