
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect, useRef } from "react";
// Refs for toast control and stored field values

import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";


import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import TemplateGallery, { type TemplateItemProps } from "./template-gallery";
import { generateMultiProviderSuggestions } from "@/ai/flows/form-suggestion-multi";
import { Button } from "@/components/ui/button";
import { CustomButton } from "@/components/ui/custom-button";
import { WhatsAppifyButton } from "@/components/ui/whatsappify-button";
import { RegenerateButton } from "@/components/ui/regenerate-button";
import { Copy, ThumbsUp, ThumbsDown } from "lucide-react"; 
import PhonePreview from "./phone-preview";
import { saveTemplate } from "@/lib/supabase";
import { saveMessageAnalytics, analyzeMessageFormatting } from "@/lib/analytics";
import { AnimatedDropdownMenu } from "@/components/ui/animated-dropdown-menu";

import { 
  messageTypesArray, 
  mediaTypesArray, 
  toneTypesArray,
  mediaTypeDescriptions,
  toneTypeDescriptions,
  type MessageType,
  type MediaType,
  type ToneType
} from "@/lib/constants";

const formSchema = z.object({
  yourTextOrIdea: z.string().min(1, "Please enter your text or idea"),
  messageType: z.union([z.enum(messageTypesArray), z.literal("")]).default(""),
  mediaType: z.union([z.enum(mediaTypesArray), z.literal("")]).default(""),
  tone: z.union([z.enum(toneTypesArray), z.literal("")]).default(""),
  field1: z.string().optional(),
  field2: z.string().optional(),
  field3: z.string().optional()
});

type FormValues = {
  yourTextOrIdea: string;
  messageType: MessageType | "";
  mediaType: MediaType | "";
  tone: ToneType | "";
  field1?: string;
  field2?: string;
  field3?: string;
};
type VariationFieldName = 'field1' | 'field2' | 'field3';

const placeholderTips = [
  "Paste your plain SMS or text here...",
  "Or describe your message idea (e.g., 'Weekend sale for shoes')...",
  "Need inspiration? Select a template below!",
  "The AI will transform your input into 3 WhatsApp variations.",
  "Remember to choose a message type for best results!"
];



function FormFlowFields() {

  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [hoveredVariation, setHoveredVariation] = useState<VariationFieldName | null>(null);
  const [regeneratingField, setRegeneratingField] = useState<VariationFieldName | null>(null);


  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yourTextOrIdea: "",
      messageType: "",
      mediaType: "",
      tone: "",
      field1: undefined,
      field2: undefined,
      field3: undefined,
    },
  });

  const currentYourTextOrIdea = form.watch("yourTextOrIdea");

  const handleSubmitSuggestions = async (values: FormValues) => {
    const { yourTextOrIdea, messageType, mediaType, tone, field1, field2, field3 } = values;
    
    if (!yourTextOrIdea || !messageType || !mediaType || !tone) {

      return;
    }
    
    // Prepare input for the multi-provider approach
    const input: {
      context: string;
      messageType: MessageType;
      mediaType: MediaType;
      tone: ToneType;
      field1: string;
      field2: string;
      field3: string;
    } = {
      context: yourTextOrIdea,
      messageType: messageType as MessageType,
      mediaType: mediaType as MediaType,
      tone: tone as ToneType,
      field1: field1 || "",
      field2: field2 || "",
      field3: field3 || ""
    };

    // Reset success toast flag for a new generation cycle

setIsLoadingSuggestions(true);
    
    try {
      // Use the new multi-provider approach
      const result = await generateMultiProviderSuggestions(input);
      
      // Update form with the new suggestions
      form.setValue("field1", result.suggestion1, { shouldValidate: true });
      form.setValue("field2", result.suggestion2, { shouldValidate: true });
      form.setValue("field3", result.suggestion3, { shouldValidate: true });
      
      // Show success message


        // remember current valid selections for regeneration fallback
        lastMessageType.current = messageType as MessageType;
        lastMediaType.current = mediaType as MediaType;
        lastTone.current = tone as ToneType;
      } catch (error) {
        console.error("Error generating suggestions:", error);

      } finally {
        setIsLoadingSuggestions(false);
      }
  };

  const handleCopy = async (fieldName: VariationFieldName) => {
    const contentToCopy = form.getValues(fieldName);
    if (!contentToCopy) {

      return;
    }

    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(contentToCopy);
      } else {
        // Fallback for browsers that don't support the Clipboard API
        const textarea = document.createElement('textarea');
        textarea.value = contentToCopy;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('execCommand error', err);
          throw err;
        } finally {
          document.body.removeChild(textarea);
        }
      }
      
      // Show success toast

      

    } catch (err) {
      console.error('Failed to copy: ', err);

    }
  };

  const handleLike = (fieldName: VariationFieldName) => {
    const contentToLike = form.getValues(fieldName);
    if (!contentToLike) return;
    
    // Show success toast

    
    // Track like action in analytics
    try {
      const currentValues = form.getValues();
      console.log('Attempting to save analytics for handleLike. Payload:', {
        originalMessage: currentValues.yourTextOrIdea,
        generatedMessage: contentToLike,
        messageType: currentValues.messageType || '',
        mediaType: currentValues.mediaType || '',
        toneOfVoice: currentValues.tone || '',
        action: 'like',
        fieldName: fieldName
      });
      saveMessageAnalytics({
        originalMessage: currentValues.yourTextOrIdea,
        generatedMessage: contentToLike,
        messageType: currentValues.messageType || '',
        mediaType: currentValues.mediaType || '',
        toneOfVoice: currentValues.tone || '',
        action: 'like',
        fieldName: fieldName
      }).then(success => {
        if (success) {
          console.log('Analytics data collected successfully for handleLike.');
        } else {
          console.log('Analytics data collection failed for handleLike.');
        }
      });
    } catch (analyticsError) {
      // Silent fail - don't disrupt user experience
      console.log('Failed to track like analytics:', analyticsError);
    }
  };

  const handleDislike = (fieldName: VariationFieldName) => {
    const contentToDislike = form.getValues(fieldName);
    if (!contentToDislike) return;
    
    // Show feedback toast

    
    // Track dislike action in analytics
    try {
      const currentValues = form.getValues();
      console.log('Attempting to save analytics for handleDislike. Payload:', {
        originalMessage: currentValues.yourTextOrIdea,
        generatedMessage: contentToDislike,
        messageType: currentValues.messageType || '',
        mediaType: currentValues.mediaType || '',
        toneOfVoice: currentValues.tone || '',
        action: 'dislike',
        fieldName: fieldName
      });
      saveMessageAnalytics({
        originalMessage: currentValues.yourTextOrIdea,
        generatedMessage: contentToDislike,
        messageType: currentValues.messageType || '',
        mediaType: currentValues.mediaType || '',
        toneOfVoice: currentValues.tone || '',
        action: 'dislike',
        fieldName: fieldName
      }).then(success => {
        if (success) {
          console.log('Analytics data collected successfully for handleDislike.');
        } else {
          console.log('Analytics data collection failed for handleDislike.');
        }
      });
    } catch (analyticsError) {
      // Silent fail - don't disrupt user experience
      console.log('Failed to track dislike analytics:', analyticsError);
    }
  };

  const handleCopyToClipboard = (text: string, variationNumber: number) => {
    navigator.clipboard.writeText(text);

    
    // Track copy action in analytics (alternative method)
    try {
      const currentValues = form.getValues();
      const fieldName = `field${variationNumber}` as VariationFieldName;
      
      console.log('Attempting to save analytics for handleCopyToClipboard. Payload:', {
        originalMessage: currentValues.yourTextOrIdea,
        generatedMessage: text,
        messageType: currentValues.messageType || '',
        mediaType: currentValues.mediaType || '',
        toneOfVoice: currentValues.tone || '',
        action: 'copy',
        fieldName: fieldName
      });
      saveMessageAnalytics({
        originalMessage: currentValues.yourTextOrIdea,
        generatedMessage: text,
        messageType: currentValues.messageType || '',
        mediaType: currentValues.mediaType || '',
        toneOfVoice: currentValues.tone || '',
        action: 'copy',
        fieldName: fieldName
      }).then(success => {
        if (success) {
          console.log('Analytics data collected successfully for handleCopyToClipboard.');
        } else {
          console.log('Analytics data collection failed for handleCopyToClipboard.');
        }
      });
    } catch (analyticsError) {
      // Silent fail - don't disrupt user experience
      console.log('Failed to track copy analytics:', analyticsError);
    }
  };

  useEffect(() => {
    const typingSpeed = 5; // Dramatically reduced from 20ms to 5ms for much faster typing
    const deletingSpeed = 3; // Dramatically reduced from 10ms to 3ms for much faster deleting
    const pauseDuration = 200; // Dramatically reduced from 500ms to 200ms for much shorter pause
    let effectIsActive = true; 

    const cleanupTypewriter = () => {
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
        typewriterTimeoutRef.current = null;
      }
    };

    if (currentYourTextOrIdea && currentYourTextOrIdea.length > 0) {
      cleanupTypewriter();
      if (animatedPlaceholder !== "") {
        setAnimatedPlaceholder(""); 
      }
      return () => { effectIsActive = false; cleanupTypewriter(); };
    }

    if (isTextareaFocused) {
      cleanupTypewriter();
      if (animatedPlaceholder !== "") {
        setAnimatedPlaceholder("");
      }
      return () => { effectIsActive = false; cleanupTypewriter(); };
    }
    
    const handleTypewriter = () => {
      if (!effectIsActive) return; 

      if (isTextareaFocused || (form.getValues("yourTextOrIdea") && form.getValues("yourTextOrIdea").length > 0)) {
        if (animatedPlaceholder !== "") setAnimatedPlaceholder("");
        cleanupTypewriter();
        return;
      }

      const currentTip = placeholderTips[currentTipIndex];
      if (isDeleting) {
        if (charIndex > 0) {
          setAnimatedPlaceholder(currentTip.substring(0, charIndex - 1));
          setCharIndex(c => c - 1);
          typewriterTimeoutRef.current = setTimeout(handleTypewriter, deletingSpeed);
        } else {
          setIsDeleting(false);
          setCurrentTipIndex(prevIndex => (prevIndex + 1) % placeholderTips.length);
          typewriterTimeoutRef.current = setTimeout(handleTypewriter, pauseDuration / 2);
        }
      } else { 
        if (charIndex < currentTip.length) {
          setAnimatedPlaceholder(currentTip.substring(0, charIndex + 1));
          setCharIndex(c => c + 1);
          typewriterTimeoutRef.current = setTimeout(handleTypewriter, typingSpeed);
        } else {
          setIsDeleting(true);
          typewriterTimeoutRef.current = setTimeout(handleTypewriter, pauseDuration);
        }
      }
    };

    typewriterTimeoutRef.current = setTimeout(handleTypewriter, 100); 

    return () => { effectIsActive = false; cleanupTypewriter(); };
  }, [
    currentYourTextOrIdea, 
    isTextareaFocused, 
    charIndex, 
    isDeleting, 
    currentTipIndex,
    form // Added form as dependency because form.getValues is used
  ]);


  const handleTemplateSelect = async (template: TemplateItemProps) => {
    form.setValue("yourTextOrIdea", template.dataAiHint, { shouldValidate: true });
    form.setValue("messageType", template.messageType as FormValues['messageType'], { shouldValidate: true });
    form.setValue("field1", template.templateContent.field1 || "", { shouldValidate: true });
    form.setValue("field2", template.templateContent.field2 || "", { shouldValidate: true });
    form.setValue("field3", template.templateContent.field3 || "", { shouldValidate: true });


    // Save the selected template to Supabase
    try {
      await saveTemplate(template);
    } catch (error) {
      console.error('Failed to save template to Supabase:', error);

    }
  };


// Store last valid selections so regenerate can fallback
const lastMessageType = useRef<MessageType | null>(null);
const lastMediaType = useRef<MediaType | null>(null);
const lastTone = useRef<ToneType | null>(null);




  



  const handleRegenerate = async (fieldName: VariationFieldName) => {
    const { yourTextOrIdea, messageType, mediaType, tone } = form.getValues();

    if (!yourTextOrIdea || !yourTextOrIdea.trim()) {
      form.setError("yourTextOrIdea", { type: "manual", message: "Please provide your text or an idea first." });

      return;
    } else {
      form.clearErrors("yourTextOrIdea");
    }
    
    if (!messageType) {
      form.setError("messageType", { type: "manual", message: "Please select a message type first." });

      return;
    } else {
      form.clearErrors("messageType");
    }
    
    if (!mediaType) {
      form.setError("mediaType", { type: "manual", message: "Please select a media type first." });

      return;
    } else {
      form.clearErrors("mediaType");
    }
    
    if (!tone) {
      form.setError("tone", { type: "manual", message: "Please select a tone first." });

     return;
    } else {
      form.clearErrors("tone");
    }
    setRegeneratingField(fieldName);
    
    // Define model names for each field
    const modelNames: Record<string, string> = {
      field1: 'Llama 3',
      field2: 'DeepSeek',
      field3: 'Gemini'
    };
    
    try {
      // Get current form values
      const currentValues = form.getValues();
      // Fallback to last stored selections if fields are missing (can happen after form edits)
      if (!currentValues.messageType && lastMessageType.current) {
        currentValues.messageType = lastMessageType.current;
      }
      if (!currentValues.mediaType && lastMediaType.current) {
        currentValues.mediaType = lastMediaType.current;
      }
      if (!currentValues.tone && lastTone.current) {
        currentValues.tone = lastTone.current;
      }
      
      // Directly call the multi-provider generator instead of hitting API route
      const regenResult = await generateMultiProviderSuggestions({
        context: currentValues.yourTextOrIdea,
        messageType: currentValues.messageType as MessageType,
        mediaType: currentValues.mediaType as MediaType,
        tone: currentValues.tone as ToneType,
        field1: '',
        field2: '',
        field3: ''
      });

      let regeneratedText = '';
      switch (fieldName) {
        case 'field1':
          regeneratedText = regenResult.suggestion1;
          break;
        case 'field2':
          regeneratedText = regenResult.suggestion2;
          break;
        case 'field3':
          regeneratedText = regenResult.suggestion3;
          break;
      }

      // Update the form field with the regenerated content
      form.setValue(fieldName, regeneratedText);
      

      
      // Track analytics for the regenerated message in the background
      try {
        // Analyze formatting in the regenerated message
        const formattingAnalysis = analyzeMessageFormatting(regeneratedText);
        
        // Save analytics data in the background (non-blocking)
        console.log('Attempting to save analytics for handleRegenerate. Payload:', {
          originalMessage: currentValues.yourTextOrIdea,
          generatedMessage: regeneratedText,
          messageType: currentValues.messageType || '',
          mediaType: currentValues.mediaType || '',
          toneOfVoice: currentValues.tone || '',
          wasRegenerated: true,
          formattingAnalysis: formattingAnalysis
        });
        saveMessageAnalytics({
          originalMessage: currentValues.yourTextOrIdea,
          generatedMessage: regeneratedText,
          messageType: currentValues.messageType || '',
          mediaType: currentValues.mediaType || '',
          toneOfVoice: currentValues.tone || '',
          wasRegenerated: true, // Flag that this was a regeneration
          formattingAnalysis: formattingAnalysis
        }).then(success => {
          if (success) {
            console.log('Analytics data collected successfully for handleRegenerate.');
          } else {
            console.log('Analytics data collection failed for handleRegenerate.');
          }
        });
      } catch (analyticsError) {
        // Silent fail - don't disrupt user experience
        console.log('Failed to collect regeneration analytics data:', analyticsError);
      }
    } catch (error) {
      console.error(`Error regenerating ${fieldName}:`, error);

    } finally {
      setRegeneratingField(null);
    }
  };

  const onSubmit = async (values: FormValues) => {
    console.log("Form data (WhatsAppified variations):", values);
    
    // Show success message immediately - don't wait for analytics

    
    // Collect analytics data in the background
    try {
      // Determine which field to use as the generated message (prioritize field1)
      const generatedMessage = values.field1 || values.field2 || values.field3 || '';
      
      // Analyze formatting in the generated message
      const formattingAnalysis = analyzeMessageFormatting(generatedMessage);
      
      console.log('Attempting to save analytics for onSubmit. Payload:', {
        originalMessage: values.yourTextOrIdea,
        generatedMessage: generatedMessage,
        messageType: values.messageType || '',
        mediaType: values.mediaType || '',
        toneOfVoice: values.tone || '',
        wasRegenerated: false,
        formattingAnalysis: formattingAnalysis
      });

      // Save analytics data in the background (non-blocking)
      saveMessageAnalytics({
        originalMessage: values.yourTextOrIdea,
        generatedMessage: generatedMessage,
        messageType: values.messageType || '',
        mediaType: values.mediaType || '',
        toneOfVoice: values.tone || '',
        wasRegenerated: false, // Set to true when regenerating
        formattingAnalysis: formattingAnalysis
      }).then(success => {
        if (success) {
          console.log('Analytics data collected successfully for onSubmit.');
        } else {
          console.log('Analytics data collection failed for onSubmit.');
        }
      });
    } catch (error) {
      // Silent fail - don't disrupt user experience
      console.log('Failed to collect analytics data for onSubmit:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-4xl mx-auto">
        <Card className="rounded-xl bg-card pt-2 pb-6 px-6">
          <CardContent className="space-y-6 p-0">
            {/* Hidden form fields to maintain form state */}
            <FormField
              control={form.control}
              name="messageType"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mediaType"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="yourTextOrIdea"
              render={({ field }) => (
                <FormItem id="tour-target-input-area" className="relative">
                  <div className="bg-[#ECE5DD] rounded-lg shadow-md px-4 pt-4" data-component-name="Controller">

                    <div className="relative">
                      <FormControl>
                        <Textarea
                          placeholder={currentYourTextOrIdea && currentYourTextOrIdea.length > 0 ? "" : animatedPlaceholder}
                          className="flex min-h-[120px] w-full rounded-lg px-3 py-2 ring-offset-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:ring-0 focus:ring-offset-0 bg-white text-zinc-800 placeholder:text-zinc-600 resize-none text-base focus-visible:ring-0 transition-all duration-200 ease-in-out shadow-sm border border-gray-300 overflow-hidden"
                          style={{ minHeight: '120px', maxHeight: 'none' }}
                          rows={5}
                          {...field}
                          onFocus={() => setIsTextareaFocused(true)}
                          onBlur={() => setIsTextareaFocused(false)}
                          onInput={(e) => {
                            // Auto-expand the textarea to fit content
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                          }}
                        />
                      </FormControl>
                    </div>
                    
                    <div className="flex items-center justify-between bg-[#ECE5DD] py-3 rounded-b-lg h-[60px]" data-component-name="Controller">
                      <div className="flex-1">
                        <AnimatedDropdownMenu
                          onSelectMessageType={(type) => {
                            form.setValue('messageType', type, { shouldValidate: true });
                          }}
                          onSelectMediaType={(type) => {
                            form.setValue('mediaType', type, { shouldValidate: true });
                          }}
                          onSelectTone={(tone) => {
                            form.setValue('tone', tone, { shouldValidate: true });
                          }}
                          initialValues={{
                            messageType: form.watch('messageType') || '',
                            mediaType: form.watch('mediaType') || '',
                            tone: form.watch('tone') || ''
                          }}
                          className="flex-1"
                        />
                      </div>
                      <div id="tour-target-transform-button-container" data-component-name="Controller" className="m-0">
                        <WhatsAppifyButton
                          id="tour-target-transform-button"
                          type="button"
                          className="px-[22px] py-[11.8px] m-0 h-[37.6px]"
                          onClick={form.handleSubmit(handleSubmitSuggestions)}
                          isLoading={isLoadingSuggestions}
                          disabled={isLoadingSuggestions || regeneratingField !== null}
                        >
                          WhatsAppify
                        </WhatsAppifyButton>
                      </div>
                    </div>
                  </div>
                  
                  {/* Error messages */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.formState.errors.messageType && (
                      <p className="text-xs text-red-600">{form.formState.errors.messageType.message}</p>
                    )}
                    {form.formState.errors.mediaType && (
                      <p className="text-xs text-red-600">{form.formState.errors.mediaType.message}</p>
                    )}
                    {form.formState.errors.tone && (
                      <p className="text-xs text-red-600">{form.formState.errors.tone.message}</p>
                    )}
                  </div>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Variations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2 gap-y-6 pt-4" id="tour-target-variations-area">
              {(['field1', 'field2', 'field3'] as VariationFieldName[]).map((fieldName, index) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName}
                  render={({ field }) => (
                    <FormItem 
                      className="flex flex-col items-center space-y-2"
                      onMouseEnter={() => setHoveredVariation(fieldName)}
                      onMouseLeave={() => setHoveredVariation(null)}
                    >
                      <FormLabel className="font-semibold text-[#075E54] mb-1 text-[20px]">Variation {index + 1}</FormLabel>
                      <div className="w-full p-0.5 rounded-[44px] transition-all cursor-default overflow-hidden">
                        <FormControl>
                          <PhonePreview 
                            messageText={field.value} 
                            currentPhoneWidth={320} 
                            zoomLevel={1}
                            mediaType={form.watch('mediaType')}
                          />
                        </FormControl>
                      </div>
                      <div className="w-full flex flex-col items-center mt-2 space-y-2">
                        <RegenerateButton
                          type="button"
                          onClick={() => handleRegenerate(fieldName)}
                          isLoading={regeneratingField === fieldName}
                          disabled={isLoadingSuggestions || regeneratingField !== null}
                          variationNumber={index + 1}
                        />
                        <div className="flex justify-center space-x-2 mt-2 w-full">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => field.value && handleCopyToClipboard(field.value, index + 1)}
                            aria-label={`Copy Variation ${index + 1}`}
                            className="h-8 w-8"
                            disabled={!field.value}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleLike(fieldName)}
                            aria-label={`Like Variation ${index + 1}`}
                            className="h-8 w-8"
                          >
                            <ThumbsUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleDislike(fieldName)}
                            aria-label={`Dislike Variation ${index + 1}`}
                            className="h-8 w-8"
                          >
                            <ThumbsDown className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </CardContent>
          <div id="tour-target-template-gallery-container">
            <TemplateGallery onTemplateClick={handleTemplateSelect} />
          </div>
        </Card>
      </form>
    </Form>
  );
}

export default FormFlowFields;
