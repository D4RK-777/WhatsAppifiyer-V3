"use client";

import { useState, useEffect } from "react";
import { MessageType, MediaType, ToneType, messageTypesArray, mediaTypesArray, toneTypesArray } from "@/lib/constants";
import { cn } from '@/lib/utils';

// Helper function to convert to camel case
const toCamelCase = (str: string) => {
  // First, capitalize the first letter of each word
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

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
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full">
        <div className="w-full md:w-auto">
          <div className="relative group w-full">
            <button
              type="button"
              className="flex items-center justify-between w-[180px] px-4 py-2 text-sm font-medium text-left text-green-600 bg-white border border-gray-200 rounded-[4px] shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-200 leading-[14px]"
            >
              <span className="truncate">{!selectedMessageType ? "Select Message Type" : toCamelCase(selectedMessageType)}</span>
              <svg className="w-5 h-5 ml-2 -mr-1 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="absolute z-10 mt-1 w-full left-0 origin-top rounded-[4px] bg-white border border-gray-200 shadow-lg ring-1 ring-black ring-opacity-10 opacity-0 invisible transition-all duration-200 transform -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
              <div className="py-1">
                <ul className="space-y-1">
                  {messageTypesArray.map((type) => (
                    <li 
                      key={type}
                      onClick={() => handleMessageTypeSelect(type as MessageType)}
                      className="px-4 py-2 text-sm text-green-700 hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      {toCamelCase(type)}
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
              className="flex items-center justify-between w-[180px] px-4 py-2 text-sm font-medium text-left text-green-600 bg-white border border-gray-200 rounded-[4px] shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-200 leading-[14px]"
            >
              <span className="truncate">{!selectedMediaType ? "Select Media Type" : toCamelCase(selectedMediaType)}</span>
              <svg className="w-5 h-5 ml-2 -mr-1 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="absolute z-10 mt-1 w-full left-0 origin-top rounded-[4px] bg-white border border-gray-200 shadow-lg ring-1 ring-black ring-opacity-10 opacity-0 invisible transition-all duration-200 transform -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
              <div className="py-1">
              <ul>
                {mediaTypesArray.map((type) => (
                  <li 
                    key={type}
                    onClick={() => handleMediaTypeSelect(type as MediaType)}
                    className="px-4 py-2 text-sm text-green-700 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    {toCamelCase(type)}
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
            className="flex items-center justify-between w-[140px] px-4 py-2 text-sm font-medium text-left text-green-600 bg-white border border-gray-200 rounded-[4px] shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-200 leading-[14px]"
          >
            <span className="break-words">{!selectedTone ? "Select Tone" : toCamelCase(selectedTone)}</span>
            <svg className="w-5 h-5 ml-2 -mr-1 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="absolute z-10 mt-1 w-[140px] left-0 origin-top rounded-[4px] bg-white border border-gray-200 shadow-lg ring-1 ring-black ring-opacity-10 opacity-0 invisible transition-all duration-200 transform -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
            <div className="py-1 rounded-xl overflow-hidden">
              <ul>
                {toneTypesArray.map((tone) => (
                  <li 
                    key={tone}
                    onClick={() => handleToneSelect(tone as ToneType)}
                    className="px-4 py-2 text-sm text-green-700 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    {toCamelCase(tone)}
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
