
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
import { Loader2, Copy, Sparkles, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react"; 
import PhonePreview from "./phone-preview";

const messageTypesArray = ["marketing", "authentication", "utility", "service"] as const;

const formSchema = z.object({
  yourTextOrIdea: z
    .string()
    .min(1, "This field cannot be empty if you want AI suggestions.")
    .max(1000, "Input must be 1000 characters or less.")
    .describe("User's text to convert or an idea for message generation.")
    .optional(), 
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
    const typingSpeed = 100; 
    const deletingSpeed = 50; 
    const pauseDuration = 2000;

    const handleTypewriter = () => {
      if (currentYourTextOrIdea && currentYourTextOrIdea.length > 0) {
        if (animatedPlaceholder !== "") setAnimatedPlaceholder("");
        return;
      }

      const currentTip = placeholderTips[currentTipIndex];
      if (isDeleting) {
        if (charIndex > 0) {
          setAnimatedPlaceholder(currentTip.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
          typewriterTimeoutRef.current = setTimeout(handleTypewriter, deletingSpeed);
        } else {
          setIsDeleting(false);
          setCurrentTipIndex((prevIndex) => (prevIndex + 1) % placeholderTips.length);
          typewriterTimeoutRef.current = setTimeout(handleTypewriter, pauseDuration / 2);
        }
      } else { 
        if (charIndex < currentTip.length) {
          setAnimatedPlaceholder(currentTip.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
          typewriterTimeoutRef.current = setTimeout(handleTypewriter, typingSpeed);
        } else {
          setIsDeleting(true);
          typewriterTimeoutRef.current = setTimeout(handleTypewriter, pauseDuration);
        }
      }
    };

    if (!currentYourTextOrIdea || currentYourTextOrIdea.length === 0) {
        typewriterTimeoutRef.current = setTimeout(handleTypewriter, isDeleting ? deletingSpeed : typingSpeed);
    } else {
        if (typewriterTimeoutRef.current) {
            clearTimeout(typewriterTimeoutRef.current);
        }
        if (animatedPlaceholder !== "") setAnimatedPlaceholder(""); 
    }


    return () => {
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
    };
  }, [charIndex, isDeleting, currentTipIndex, currentYourTextOrIdea, animatedPlaceholder]);


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
      const suggestionsInput: SuggestFormFieldsInput = {
        context: yourTextOrIdea || "", 
        messageType,
        field1: field1 || "", 
        field2: field2 || "",
        field3: field3 || "",
      };
      
      const suggestions: SuggestFormFieldsOutput = await suggestFormFields(suggestionsInput);
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
    if (contentToCopy) {
      try {
        await navigator.clipboard.writeText(contentToCopy);
        toast({
          title: "Copied!",
          description: `Variation ${fieldName.charAt(fieldName.length - 1)} copied to clipboard.`,
        });
      } catch (err) {
        console.error('Failed to copy: ', err);
        toast({
          title: "Error Copying",
          description: "Could not copy text to clipboard.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Nothing to Copy",
        description: "This variation is empty.",
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
      const suggestionsInput: SuggestFormFieldsInput = {
        context: yourTextOrIdea,
        messageType,
      };
      const newSuggestions = await suggestFormFields(suggestionsInput);

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
        <Card className="shadow-xl rounded-xl bg-card p-6">
          <CardContent className="space-y-6 p-0">
            <FormField
              control={form.control}
              name="yourTextOrIdea"
              render={({ field }) => (
                <FormItem id="tour-target-input-area">
                  <FormControl>
                    <Textarea
                      placeholder={currentYourTextOrIdea && currentYourTextOrIdea.length > 0 ? "" : animatedPlaceholder}
                      className="bg-[#ECE5DD] text-zinc-800 placeholder:text-zinc-600 resize-none rounded-md text-base shadow-[0_0_5px_hsl(var(--accent)_/_0.4)] focus-visible:ring-0 focus-visible:shadow-[0_0_12px_hsl(var(--accent)_/_0.75)] transition-shadow duration-200 ease-in-out"
                      rows={8}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="messageType"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center" id="tour-target-message-type">
                  <FormLabel className="text-lg font-semibold text-foreground text-center">Select the message type you want to send</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2 pt-1 justify-center">
                      {messageTypesArray.map((type) => (
                        <Button
                          key={type}
                          type="button"
                          variant={field.value === type ? "default" : "outline"}
                          onClick={() => field.onChange(type)}
                          className="capitalize flex-grow sm:flex-grow-0 rounded-full px-4 py-1.5 text-sm"
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-center pt-4 pb-2" id="tour-target-transform-button-container">
              <Button
                id="tour-target-transform-button"
                type="button"
                onClick={handleGetSuggestions}
                disabled={isLoadingSuggestions || regeneratingField !== null}
                className={cn(
                  "w-1/2", 
                  "relative overflow-hidden", 
                  "bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900", 
                  "text-slate-100", 
                  "border border-purple-700", 
                  "hover:border-purple-500", 
                  "hover:from-indigo-900 hover:via-purple-800 hover:to-slate-800 hover:text-white", 
                  "focus-visible:ring-purple-400", 
                  "galaxy-stars-effect", 
                  !isLoadingSuggestions && regeneratingField === null && "animate-sparkle-icon", 
                  "px-6 py-3 text-base rounded-lg" 
                )}
              >
                {isLoadingSuggestions ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" /> 
                )}
                WhatsAppify Into Something Spectacular
              </Button>
            </div>
            
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
                         <Button
                            type="button"
                            onClick={() => handleRegenerate(fieldName)}
                            disabled={isLoadingSuggestions || regeneratingField !== null}
                            className={cn(
                              "w-full", 
                              "relative overflow-hidden", 
                              "bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900", 
                              "text-slate-100", 
                              "border border-purple-700", 
                              "hover:border-purple-500", 
                              "hover:from-indigo-900 hover:via-purple-800 hover:to-slate-800 hover:text-white", 
                              "focus-visible:ring-purple-400", 
                              "galaxy-stars-effect", 
                              (!isLoadingSuggestions && regeneratingField !== fieldName) && "animate-sparkle-icon", 
                              "px-4 py-2 text-sm rounded-md" 
                            )}
                          >
                            {regeneratingField === fieldName ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Sparkles className="mr-2 h-4 w-4" /> 
                            )}
                            Regenerate Variation {index + 1}
                          </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation(); 
                            handleCopy(fieldName);
                          }}
                          className={cn(
                            "w-full shadow-sm",
                            hoveredVariation === fieldName && "ring-2 ring-primary ring-offset-1 ring-offset-background text-foreground"
                          )}
                          disabled={!field.value}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Variation {index + 1}
                        </Button>
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
    

    


