"use client";

import { useState, useEffect } from "react";
import { MessageType, MediaType, ToneType, messageTypesArray, mediaTypesArray, toneTypesArray } from "@/lib/constants";
import { cn } from '@/lib/utils';

// Helper function to capitalize first letter
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

interface AnimatedDropdownMenuProps {
  onSelectMessageType?: (type: MessageType) => void;
  onSelectMediaType?: (type: MediaType) => void;
  onSelectTone?: (tone: ToneType) => void;
  className?: string;
  initialValues: {
    messageType: MessageType;
    mediaType: MediaType;
    tone: ToneType;
  };
}

export function AnimatedDropdownMenu({
  onSelectMessageType,
  onSelectMediaType,
  onSelectTone,
  className,
  initialValues,
}: AnimatedDropdownMenuProps) {
  const [selectedMessageType, setSelectedMessageType] = useState<MessageType>(initialValues.messageType);
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType>(initialValues.mediaType);
  const [selectedTone, setSelectedTone] = useState<ToneType>(initialValues.tone);

  // Update internal state when initialValues change
  useEffect(() => {
    setSelectedMessageType(initialValues.messageType);
    setSelectedMediaType(initialValues.mediaType);
    setSelectedTone(initialValues.tone);
  }, [initialValues]);
  const handleMessageTypeSelect = (type: MessageType) => {
    setSelectedMessageType(type);
    if (onSelectMessageType) onSelectMessageType(type);
  };

  const handleMediaTypeSelect = (type: MediaType) => {
    setSelectedMediaType(type);
    if (onSelectMediaType) onSelectMediaType(type);
  };

  const handleToneSelect = (tone: ToneType) => {
    setSelectedTone(tone);
    if (onSelectTone) onSelectTone(tone);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col md:flex-row justify-center items-start gap-3 w-full">
        <div className="flex flex-col space-y-1 w-full md:w-[180px]">
          <h3 className="text-sm font-medium text-gray-700">Select Message Type</h3>
          <p className="text-xs text-gray-500 mb-1">Choose message type</p>
          <div className="relative group w-full">
          <button
            type="button"
            className="flex items-center justify-between w-full max-w-[150px] px-4 py-2 text-sm font-medium text-left text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <span className="truncate">{capitalize(selectedMessageType)}</span>
            <svg className="w-5 h-5 ml-2 -mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <ul className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md py-1 opacity-0 invisible transition-all duration-200 transform -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
            {messageTypesArray.map((type) => (
              <li 
                key={type}
                onClick={() => handleMessageTypeSelect(type as MessageType)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors"
              >
                {capitalize(type)}
              </li>
            ))}
          </ul>
          </div>
        </div>

        <div className="flex flex-col space-y-1 w-full md:w-[180px]">
          <h3 className="text-sm font-medium text-gray-700">Select Media Type</h3>
          <p className="text-xs text-gray-500 mb-1">Choose media type</p>
          <div className="relative group w-full">
          <button
            type="button"
            className="flex items-center justify-between w-full max-w-[150px] px-4 py-2 text-sm font-medium text-left text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <span className="truncate">{capitalize(selectedMediaType)}</span>
            <svg className="w-5 h-5 ml-2 -mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <ul className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md py-1 opacity-0 invisible transition-all duration-200 transform -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
            {mediaTypesArray.map((type) => (
              <li 
                key={type}
                onClick={() => handleMediaTypeSelect(type as MediaType)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors"
              >
                {capitalize(type)}
              </li>
            ))}
          </ul>
          </div>
        </div>

        <div className="flex flex-col space-y-1 w-full md:w-[180px]">
          <h3 className="text-sm font-medium text-gray-700">Select Tone</h3>
          <p className="text-xs text-gray-500 mb-1">Choose message tone</p>
          <div className="relative group w-full">
          <button
            type="button"
            className="flex items-center justify-between w-full max-w-[150px] px-4 py-2 text-sm font-medium text-left text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <span className="truncate">{capitalize(selectedTone)}</span>
            <svg className="w-5 h-5 ml-2 -mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <ul className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md py-1 opacity-0 invisible transition-all duration-200 transform -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
            {toneTypesArray.map((tone) => (
              <li 
                key={tone}
                onClick={() => handleToneSelect(tone as ToneType)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors"
              >
                {capitalize(tone)}
              </li>
            ))}
          </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimatedDropdownMenu;
