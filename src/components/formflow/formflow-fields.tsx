
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect, useRef } from "react";
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
import { useToast } from "@/hooks/use-toast";
import TemplateGallery, { type TemplateItemProps } from "./template-gallery";
import { suggestFormFields, type SuggestFormFieldsInput, type SuggestFormFieldsOutput } from "@/ai/flows/form-suggestion";
import { Button } from "@/components/ui/button";
import { CustomButton } from "@/components/ui/custom-button";
import { WhatsAppifyButton } from "@/components/ui/whatsappify-button";
import { TutorialButtonWithHandler } from "@/components/tutorial/WhatsAppTutorial";
import { RegenerateButton } from "@/components/ui/regenerate-button";
// Tutorial components removed
import { Copy, ThumbsUp, ThumbsDown } from "lucide-react"; 
import PhonePreview from "./phone-preview";

const messageTypesArray = ["marketing", "authentication", "utility", "service"] as const;

const formSchema = z.object({
  yourTextOrIdea: z
    .string()
    .min(1, "This field cannot be empty if you want AI suggestions.")
    .max(1000, "Input must be 1000 characters or less.")
    .describe("User's text to convert or an idea for message generation."),
  messageType: z.enum(messageTypesArray, {
    required_error: "Please select a message type.",
  }),
  field1: z
    .string()
    .max(1500, "Suggestion 1 (Variation) must be 1500 characters or less.")
    .optional()
    .describe("AI-generated Variation 1 of the WhatsApp message."),
  field2: z
    .string()
    .max(1500, "Suggestion 2 (Variation) must be 1500 characters or less.")
    .optional()
    .describe("AI-generated Variation 2 of the WhatsApp message."),
  field3: z
    .string()
    .max(1500, "Suggestion 3 (Variation) must be 1500 characters or less.")
    .optional()
    .describe("AI-generated Variation 3 of the WhatsApp message."),
});

type FormValues = z.infer<typeof formSchema>;
type VariationFieldName = 'field1' | 'field2' | 'field3';

const placeholderTips = [
  "Paste your plain SMS or text here...",
  "Or describe your message idea (e.g., 'Weekend sale for shoes')...",
  "Need inspiration? Select a template below!",
  "The AI will transform your input into 3 WhatsApp variations.",
  "Remember to choose a message type for best results!"
];

function FormFlowFields() {
  const { toast } = useToast();
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
      messageType: undefined,
      field1: "",
      field2: "",
      field3: "",
    },
  });

  const currentYourTextOrIdea = form.watch("yourTextOrIdea");

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


  const handleTemplateSelect = (template: TemplateItemProps) => {
    form.setValue("yourTextOrIdea", template.dataAiHint, { shouldValidate: true });
    form.setValue("messageType", template.messageType as FormValues['messageType'], { shouldValidate: true });
    form.setValue("field1", template.templateContent.field1 || "", { shouldValidate: true });
    form.setValue("field2", template.templateContent.field2 || "", { shouldValidate: true });
    form.setValue("field3", template.templateContent.field3 || "", { shouldValidate: true });
    toast({
      title: `Template "${template.title}" Applied!`,
      description: "Text/Idea, message type, and initial field content pre-populated. Edit or get AI suggestions.",
    });
  };

  const handleGetSuggestions = async () => {
    const { yourTextOrIdea, messageType, field1, field2, field3 } = form.getValues();
    
    let hasError = false;
    if (!yourTextOrIdea || !yourTextOrIdea.trim()) {
      form.setError("yourTextOrIdea", { type: "manual", message: "Please provide your text or an idea." });
      hasError = true;
    } else {
      form.clearErrors("yourTextOrIdea");
    }

    if (!messageType) {
      form.setError("messageType", { type: "manual", message: "Please select a message type." });
      hasError = true;
    } else {
      form.clearErrors("messageType");
    }

    if (hasError) return;

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context: yourTextOrIdea || "",
          messageType,
          field1: field1 || "",
          field2: field2 || "",
          field3: field3 || "",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const suggestions = await response.json();
      
      form.setValue("field1", suggestions.suggestion1, { shouldValidate: true });
      form.setValue("field2", suggestions.suggestion2, { shouldValidate: true });
      form.setValue("field3", suggestions.suggestion3, { shouldValidate: true });
      
      toast({
        title: "WhatsApp Variations Loaded!",
        description: "AI-powered WhatsApp message variations populated.",
      });
    } catch (error) {
      console.error("Error getting suggestions:", error);
      toast({
        title: "Error",
        description: "Failed to get AI suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleCopy = async (fieldName: VariationFieldName) => {
    const contentToCopy = form.getValues(fieldName);
    if (!contentToCopy) {
      toast({
        title: "Nothing to Copy",
        description: "This variation is empty.",
        variant: "destructive",
      });
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
        textarea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (!successful) {
            throw new Error('Copy command was unsuccessful');
          }
        } finally {
          document.body.removeChild(textarea);
        }
      }
      
      toast({
        title: "Copied!",
        description: `Variation ${fieldName.charAt(fieldName.length - 1)} copied to clipboard.`,
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast({
        title: "Error Copying",
        description: "Could not copy text to clipboard. Please check your browser permissions.",
        variant: "destructive",
      });
    }
  };
  
  const handleLike = (fieldName: VariationFieldName) => {
    toast({ title: `Liked Variation ${fieldName.charAt(fieldName.length - 1)}`, description: "Feedback submitted (placeholder)." });
  };

  const handleDislike = (fieldName: VariationFieldName) => {
    toast({ title: `Disliked Variation ${fieldName.charAt(fieldName.length - 1)}`, description: "Feedback submitted (placeholder)." });
  };

  const handleRegenerate = async (fieldName: VariationFieldName) => {
    const { yourTextOrIdea, messageType } = form.getValues();

    if (!yourTextOrIdea || !yourTextOrIdea.trim()) {
      form.setError("yourTextOrIdea", { type: "manual", message: "Please provide your text or an idea first." });
      toast({ title: "Input Missing", description: "Please provide your text or an idea before regenerating.", variant: "destructive" });
      return;
    } else {
      form.clearErrors("yourTextOrIdea");
    }
    if (!messageType) {
      form.setError("messageType", { type: "manual", message: "Please select a message type first." });
      toast({ title: "Message Type Missing", description: "Please select a message type before regenerating.", variant: "destructive" });
      return;
    } else {
      form.clearErrors("messageType");
    }

    setRegeneratingField(fieldName);
    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context: yourTextOrIdea,
          messageType,
          // Not passing field1, field2, field3 to get entirely new suggestions
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newSuggestions = await response.json();

      if (fieldName === 'field1') {
        form.setValue("field1", newSuggestions.suggestion1, { shouldValidate: true });
      } else if (fieldName === 'field2') {
        form.setValue("field2", newSuggestions.suggestion2, { shouldValidate: true });
      } else if (fieldName === 'field3') {
        form.setValue("field3", newSuggestions.suggestion3, { shouldValidate: true });
      }
      toast({ title: `Variation ${fieldName.charAt(fieldName.length - 1)} Regenerated!`, description: "A new suggestion has been populated." });
    } catch (error) {
      console.error(`Error regenerating ${fieldName}:`, error);
      toast({ title: "Regeneration Error", description: `Failed to regenerate Variation ${fieldName.charAt(fieldName.length - 1)}. Please try again.`, variant: "destructive" });
    } finally {
      setRegeneratingField(null);
    }
  };

  const onSubmit = (values: FormValues) => {
    console.log("Form data (WhatsAppified variations):", values);
    toast({
      title: "Form Data Logged",
      description: `Current variations logged to console. You would typically send this data to a backend.`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="messageType"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center mb-2" id="tour-target-message-type">
              <FormLabel className="text-lg font-semibold text-foreground text-center">Select the message type you want to send</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2 pt-1 justify-center">
                  <TutorialButtonWithHandler />
                  {messageTypesArray.map((type) => (
                    <CustomButton
                      key={type}
                      type="button"
                      onClick={() => field.onChange(type)}
                      active={field.value === type}
                      className="capitalize flex-grow sm:flex-grow-0"
                    >
                      {type}
                    </CustomButton>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Card className="rounded-xl bg-card p-6">
          <CardContent className="space-y-6 p-0">
            
            <FormField
              control={form.control}
              name="yourTextOrIdea"
              render={({ field }) => (
                <FormItem id="tour-target-input-area" className="relative">
                  <div className="mb-2 text-xs text-gray-700 whatsapp-instruction-text">
                    Paste your boring SMS or plain text below to transform it. If you need an idea simply tell the AI what you want and let the ideas flow. Use the template gallery for more inspiration. <span className="font-medium">*AI can make mistakes, please check your work before copying.</span>
                  </div>
                  <div className="relative">
                    <FormControl>
                      <Textarea
                        placeholder={currentYourTextOrIdea && currentYourTextOrIdea.length > 0 ? "" : animatedPlaceholder}
                        className="bg-[#ECE5DD] text-zinc-800 placeholder:text-zinc-600 resize-none rounded-md text-base focus-visible:ring-0 transition-shadow duration-200 ease-in-out"
                        rows={8}
                        {...field}
                        onFocus={() => setIsTextareaFocused(true)}
                        onBlur={() => setIsTextareaFocused(false)}
                      />
                    </FormControl>
                    <div className="absolute bottom-4 right-4" id="tour-target-transform-button-container">
                      <WhatsAppifyButton
                        id="tour-target-transform-button"
                        type="button"
                        onClick={handleGetSuggestions}
                        isLoading={isLoadingSuggestions}
                        disabled={isLoadingSuggestions || regeneratingField !== null}
                        className="px-6 py-2 h-10 rounded-full shadow-md"
                      >
                        WhatsAppify
                      </WhatsAppifyButton>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                      <FormLabel className="font-semibold text-foreground mb-1">WhatsApp Variation {index + 1}</FormLabel>
                      <div className="w-full p-0.5 rounded-[44px] transition-all cursor-default">
                        <FormControl>
                          <PhonePreview messageText={field.value} currentPhoneWidth={320} zoomLevel={1} />
                        </FormControl>
                      </div>
                      <div className="w-full max-w-[320px] mx-auto mt-2 flex flex-col space-y-2">
                         <RegenerateButton
                            type="button"
                            onClick={() => handleRegenerate(fieldName)}
                            isLoading={regeneratingField === fieldName}
                            disabled={isLoadingSuggestions || regeneratingField !== null}
                            variationNumber={index + 1}
                            className={cn(
                              "w-full mt-2",
                              regeneratingField === fieldName && "opacity-100"
                            )}
                          />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(fieldName);
                          }}
                          disabled={!field.value}
                          className={cn(
                            'copy-variation-button relative inline-flex items-center justify-center',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075E54] focus-visible:ring-offset-2',
                            'ring-2 ring-primary ring-offset-1 ring-offset-background text-foreground',
                            'hover:bg-accent/50 transition-all w-full rounded-full overflow-hidden',
                            hoveredVariation === fieldName && 'ring-2 ring-primary',
                            !field.value && 'opacity-60 cursor-not-allowed'
                          )}
                          data-copy-variation-id={`copy-variation-${index + 1}`}
                        >
                          <div className="copy-variation-content flex items-center justify-center gap-2">
                            <Copy className="copy-variation-icon h-4 w-4" />
                            <span className="copy-variation-text font-semibold">Copy Variation {index + 1}</span>
                          </div>
                        </button>
                        <div className="flex justify-center space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleLike(fieldName)} aria-label={`Like Variation ${index + 1}`} className="shadow-sm">
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDislike(fieldName)} aria-label={`Dislike Variation ${index + 1}`} className="shadow-sm">
                            <ThumbsDown className="h-4 w-4" />
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
    

    




