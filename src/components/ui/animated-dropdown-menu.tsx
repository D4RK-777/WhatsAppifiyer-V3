"use client";

import { useState, useEffect } from "react";
import { MessageType, MediaType, ToneType, messageTypesArray, mediaTypesArray, toneTypesArray } from "@/lib/constants";
import { cn } from '@/lib/utils';

// Helper function to capitalize first letter
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

interface AnimatedDropdownMenuProps {
  onSelectMessageType?: (type: MessageType | "") => void;
  onSelectMediaType?: (type: MediaType | "") => void;
  onSelectTone?: (tone: ToneType | "") => void;
  className?: string;
  initialValues?: {
    messageType?: MessageType | "";
    mediaType?: MediaType | "";
    tone?: ToneType | "";
  };
}

export function AnimatedDropdownMenu({
  onSelectMessageType,
  onSelectMediaType,
  onSelectTone,
  className,
  initialValues = {
    messageType: "" as MessageType,
    mediaType: "" as MediaType,
    tone: "" as ToneType
  },
}: AnimatedDropdownMenuProps) {
  const [selectedMessageType, setSelectedMessageType] = useState<MessageType | "">(initialValues?.messageType || "");
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType | "">(initialValues?.mediaType || "");
  const [selectedTone, setSelectedTone] = useState<ToneType | "">(initialValues?.tone || "");

  // Update internal state when initialValues change
  useEffect(() => {
    setSelectedMessageType(initialValues?.messageType || "");
    setSelectedMediaType(initialValues?.mediaType || "");
    setSelectedTone(initialValues?.tone || "");
  }, [initialValues]);
  const handleMessageTypeSelect = (type: MessageType | "") => {
    setSelectedMessageType(type);
    if (onSelectMessageType && type) onSelectMessageType(type);
  };

  const handleMediaTypeSelect = (type: MediaType | "") => {
    setSelectedMediaType(type);
    if (onSelectMediaType && type) onSelectMediaType(type);
  };

  const handleToneSelect = (tone: ToneType | "") => {
    setSelectedTone(tone);
    if (onSelectTone) onSelectTone(tone);
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full px-4">
        <div className="w-full md:w-auto">
          <div className="relative group w-full">
            <button
              type="button"
              className="flex items-center justify-between w-full max-w-[220px] mx-auto px-4 py-2 text-sm font-medium text-left text-white bg-gradient-to-r from-[#625DF5] to-[#1BB3FF] border-0 rounded-full shadow-md hover:shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-200"
            >
              <span className="truncate">{!selectedMessageType ? "Select Message Type" : selectedMessageType}</span>
              <svg className="w-5 h-5 ml-2 -mr-1 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="absolute z-10 mt-1 w-full max-w-[220px] left-1/2 -translate-x-1/2 origin-top rounded-xl bg-gradient-to-r from-[#625DF5] to-[#1BB3FF] shadow-lg ring-1 ring-black ring-opacity-10 opacity-0 invisible transition-all duration-200 transform -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
              <div className="py-1">
                <ul className="space-y-1">
                  {messageTypesArray.map((type) => (
                    <li 
                      key={type}
                      onClick={() => handleMessageTypeSelect(type as MessageType)}
                      className="px-4 py-2 text-sm text-white hover:bg-white hover:bg-opacity-30 cursor-pointer transition-colors"
                    >
                      {capitalize(type)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto">
          <div className="relative group w-full">
            <button
              type="button"
              className="flex items-center justify-between w-full max-w-[220px] mx-auto px-4 py-2 text-sm font-medium text-left text-white bg-gradient-to-r from-[#625DF5] to-[#1BB3FF] border-0 rounded-full shadow-md hover:shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-200"
            >
              <span className="truncate">{!selectedMediaType ? "Select Media Type" : selectedMediaType}</span>
              <svg className="w-5 h-5 ml-2 -mr-1 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="absolute z-10 mt-1 w-full max-w-[220px] left-1/2 -translate-x-1/2 origin-top rounded-xl bg-gradient-to-r from-[#625DF5] to-[#1BB3FF] shadow-lg ring-1 ring-black ring-opacity-10 opacity-0 invisible transition-all duration-200 transform -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
              <div className="py-1">
              <ul>
                {mediaTypesArray.map((type) => (
                  <li 
                    key={type}
                    onClick={() => handleMediaTypeSelect(type as MediaType)}
                    className="px-4 py-2 text-sm text-white hover:bg-white hover:bg-opacity-40 cursor-pointer transition-colors"
                  >
                    {capitalize(type)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          
          <div className="relative group flex-1 min-w-0">
          <button
            type="button"
            className="flex items-center justify-between flex-1 min-w-0 max-w-[220px] px-4 py-2 text-sm font-medium text-left text-white bg-gradient-to-r from-[#625DF5] to-[#1BB3FF] border-0 rounded-full shadow-md hover:shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-200"
          >
            <span className="break-words">{!selectedTone ? "Select Tone" : capitalize(selectedTone)}</span>
            <svg className="w-5 h-5 ml-2 -mr-1 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="absolute z-10 mt-1 flex-1 min-w-0 max-w-[220px] origin-top-right rounded-xl bg-gradient-to-r from-[#625DF5] to-[#1BB3FF] shadow-lg ring-1 ring-black ring-opacity-10 focus:outline-none opacity-0 invisible transition-all duration-200 transform -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
            <div className="py-1 rounded-xl overflow-hidden">
              <ul>
                {toneTypesArray.map((tone) => (
                  <li 
                    key={tone}
                    onClick={() => handleToneSelect(tone as ToneType)}
                    className="px-4 py-2 text-sm text-white hover:bg-white hover:bg-opacity-40 cursor-pointer transition-colors"
                  >
                    {capitalize(tone)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimatedDropdownMenu;
