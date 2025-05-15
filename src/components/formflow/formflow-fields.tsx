
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import TemplateGallery, { type TemplateItemProps, type MessageType as TemplateMessageType } from "./template-gallery";
import { suggestFormFields, type SuggestFormFieldsInput, type SuggestFormFieldsOutput } from "@/ai/flows/form-suggestion";
import { Button } from "@/components/ui/button";
import { Loader2, Copy } from "lucide-react";
import PhonePreview from "./phone-preview";

const messageTypesArray = ["marketing", "authentication", "utility", "service"] as const;

const formSchema = z.object({
  yourTextOrIdea: z
    .string()
    .min(1, "This field cannot be empty.")
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


function FormFlowFields() {
  const { toast } = useToast();
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<VariationFieldName | null>(null);

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

  const handleTemplateSelect = (template: TemplateItemProps) => {
    form.setValue("yourTextOrIdea", template.dataAiHint, { shouldValidate: true });
    form.setValue("messageType", template.messageType as FormValues['messageType'], { shouldValidate: true });
    form.setValue("field1", template.templateContent.field1 || "", { shouldValidate: true });
    form.setValue("field2", template.templateContent.field2 || "", { shouldValidate: true });
    form.setValue("field3", template.templateContent.field3 || "", { shouldValidate: true });
    setSelectedVariation(null);
    toast({
      title: `Template "${template.title}" Applied!`,
      description: "Text/Idea, message type, and initial field content pre-populated. Edit or get AI suggestions.",
    });
  };

  const handleGetSuggestions = async () => {
    const { yourTextOrIdea, messageType, field1, field2, field3 } = form.getValues();
    
    let hasError = false;
    if (!yourTextOrIdea.trim()) {
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
    setSelectedVariation(null); 
    try {
      const suggestionsInput: SuggestFormFieldsInput = {
        context: yourTextOrIdea,
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

  // This onSubmit is not strictly necessary if the primary action is AI suggestions and copying.
  // Kept for potential future use or if there's a scenario to submit the whole form.
  const onSubmit = (values: FormValues) => {
    console.log("Form data (WhatsAppified variations):", values);
    const selectedValue = selectedVariation ? values[selectedVariation] : "No variation selected";
    console.log("Selected variation content:", selectedValue);
    toast({
      title: "Form Data & Selection Logged",
      description: `Current variations logged. Selected: ${selectedVariation || 'None'}.`,
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
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your SMS or text here, or describe your message idea (e.g., 'Weekend sale announcement for shoes'). You can also select a template below."
                      className="resize-none rounded-md shadow-sm text-base focus-visible:ring-0 focus-visible:shadow-[0_0_10px_hsl(var(--accent)_/_0.7)]"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-muted-foreground">
                    This text or idea will be transformed by the AI into WhatsApp message variations.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="messageType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-foreground">Message Type</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {messageTypesArray.map((type) => (
                        <Button
                          key={type}
                          type="button" // Important to prevent form submission
                          variant={field.value === type ? "default" : "outline"}
                          onClick={() => field.onChange(type)}
                          className="capitalize flex-grow sm:flex-grow-0" // Grow on small screens, not on larger
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                  <FormDescription className="text-sm text-muted-foreground">
                    Select the primary purpose of your WhatsApp message.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-center pt-4 pb-2">
              <Button
                type="button"
                onClick={handleGetSuggestions}
                disabled={isLoadingSuggestions}
                className="px-8 py-3 text-base rounded-lg shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto max-w-xs"
              >
                {isLoadingSuggestions ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    WhatsAppifying...
                  </>
                ) : (
                  "Get AI WhatsApp Variations"
                )}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2 gap-y-6 pt-4">
              {(['field1', 'field2', 'field3'] as VariationFieldName[]).map((fieldName, index) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName}
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center space-y-2">
                      <FormLabel className="font-semibold text-foreground mb-1">WhatsApp Variation {index + 1}</FormLabel>
                      <div
                        className={cn(
                          "w-full p-0.5 rounded-[44px] transition-all cursor-pointer",
                          selectedVariation === fieldName ? "shadow-lg" : "" 
                        )}
                        onClick={() => setSelectedVariation(fieldName)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedVariation(fieldName);}}
                        aria-pressed={selectedVariation === fieldName}
                        aria-label={`Select WhatsApp Variation ${index + 1}`}
                      >
                        <FormControl>
                          <PhonePreview messageText={field.value} currentPhoneWidth={280} zoomLevel={1} />
                        </FormControl>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation(); 
                          handleCopy(fieldName);
                        }}
                        className="w-full max-w-[280px] mx-auto mt-2"
                        disabled={!field.value}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Variation {index + 1}
                      </Button>
                       <FormDescription className="text-xs text-muted-foreground">
                        {selectedVariation === fieldName ? "Selected. " : ""}Click preview to select.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </CardContent>
          <TemplateGallery onTemplateClick={handleTemplateSelect} />
        </Card>
      </form>
    </Form>
  );
}

export default FormFlowFields;
