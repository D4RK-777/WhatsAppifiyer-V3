
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import TemplateGallery, { type TemplateItemProps } from "./template-gallery";
import { suggestFormFields, type SuggestFormFieldsInput, type SuggestFormFieldsOutput } from "@/ai/flows/form-suggestion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  yourTextOrIdea: z
    .string()
    .min(1, "This field cannot be empty.")
    .max(1000, "Input must be 1000 characters or less.")
    .describe("User's text to convert or an idea for message generation."),
  messageType: z.enum(["marketing", "authentication", "utility", "service"], {
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

// Component to render WhatsApp-like formatted text
const WhatsAppMessagePreview = ({ content }: { content: string | undefined }) => {
  
  let keyCounter = 0;
  const generateKey = (type: string) => `${type}-${keyCounter++}`;

  const parseTextToReact = (text: string): React.ReactNode[] => {
    if (!text) return [];

    // 1. ```codeblock``` (multiline, non-greedy)
    const codeMatch = text.match(/^(.*?)```([\s\S]*?)```(.*)$/s);
    if (codeMatch) {
      return [
        ...parseTextToReact(codeMatch[1]), // Before
        <pre key={generateKey('codeblock')} className="bg-muted p-2 my-1 rounded-md text-sm font-mono whitespace-pre-wrap break-all">
          <code>{codeMatch[2]}</code>
        </pre>,
        ...parseTextToReact(codeMatch[3])  // After
      ];
    }

    // 2. *bold* (non-greedy, content must exist)
    const boldMatch = text.match(/^(.*?)\*([^*]+?)\*(.*)$/s);
    if (boldMatch) {
      return [
        ...parseTextToReact(boldMatch[1]),
        <strong key={generateKey('bold')}>{parseTextToReact(boldMatch[2])}</strong>,
        ...parseTextToReact(boldMatch[3])
      ];
    }

    // 3. _italic_ (non-greedy, content must exist)
    const italicMatch = text.match(/^(.*?)_([^_]+?)_(.*)$/s);
    if (italicMatch) {
      return [
        ...parseTextToReact(italicMatch[1]),
        <em key={generateKey('italic')}>{parseTextToReact(italicMatch[2])}</em>,
        ...parseTextToReact(italicMatch[3])
      ];
    }
    
    // 4. ~strikethrough~ (non-greedy, content must exist)
    const strikeMatch = text.match(/^(.*?)~([^~]+?)~(.*)$/s);
    if (strikeMatch) {
      return [
        ...parseTextToReact(strikeMatch[1]),
        <del key={generateKey('strike')}>{parseTextToReact(strikeMatch[2])}</del>,
        ...parseTextToReact(strikeMatch[3])
      ];
    }

    // 5. Newlines and plain text
    return text.split(/(\\n)/g).map((part, index) => {
      if (part === '\\n') return <br key={generateKey(`br-${index}`)} />;
      if (part) return <span key={generateKey(`text-${index}`)}>{part}</span>; 
      return null;
    }).filter(Boolean); 
  };
  
  const formattedNodes = parseTextToReact(content?.replace(/\n/g, '\\n') || '');

  return (
    // Outer container: Simulates a phone body/frame
    <div className="w-full max-w-[300px] mx-auto aspect-[9/17] bg-muted/30 p-1.5 rounded-[28px] shadow-xl border border-border flex flex-col overflow-hidden">
      {/* Top "notch" or speaker area visual cue */}
      <div className="h-5 bg-foreground/10 w-20 mx-auto rounded-b-lg mb-1 shrink-0"></div>

      {/* "Screen" area where the message content is displayed */}
      <div className="flex-grow bg-card rounded-[20px] text-card-foreground text-sm overflow-y-auto p-3 flex flex-col items-start">
        {(!content || content.trim() === "") ? (
          <div className="flex-grow w-full flex items-center justify-center text-muted-foreground text-xs p-2 text-center">
            AI-generated WhatsApp message variation will appear here.
          </div>
        ) : (
          <div className="w-full"> {/* Wrapper to ensure content flows correctly */}
            {formattedNodes}
          </div>
        )}
      </div>
    </div>
  );
};


function FormFlowFields() {
  const { toast } = useToast();
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

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
    form.setValue("messageType", template.messageType, { shouldValidate: true });
    form.setValue("field1", template.templateContent.field1 || "", { shouldValidate: true });
    form.setValue("field2", template.templateContent.field2 || "", { shouldValidate: false }); 
    form.setValue("field3", template.templateContent.field3 || "", { shouldValidate: false }); 
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

  const onSubmit = (values: FormValues) => {
    // This function is not currently tied to a submit button but might be used for other submission logic.
    console.log("Form data (WhatsAppified variations):", values);
    toast({
      title: "Form Data Logged",
      description: "Current WhatsApp variations have been logged to the console.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="shadow-xl rounded-xl bg-card">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary">
              WhatsAppify Your Text
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your text or an idea, select a message type, then get AI-powered WhatsApp formatted variations. Or, pick a template!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="yourTextOrIdea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Your Text / Message Idea</FormLabel>
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
                  <FormLabel className="text-lg font-semibold">Message Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-md shadow-sm text-base focus-visible:ring-0 focus-visible:shadow-[0_0_10px_hsl(var(--accent)_/_0.7)]">
                        <SelectValue placeholder="Select a message type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="authentication">Authentication</SelectItem>
                      <SelectItem value="utility">Utility</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                    </SelectContent>
                  </Select>
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10 pt-4">
              <FormField
                control={form.control}
                name="field1"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel className="font-semibold text-foreground mb-2">WhatsApp Variation 1</FormLabel>
                    <FormControl>
                      <WhatsAppMessagePreview content={field.value} />
                    </FormControl>
                     <FormDescription className="text-xs text-muted-foreground mt-2">
                      AI-generated variation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="field2"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel className="font-semibold text-foreground mb-2">WhatsApp Variation 2</FormLabel>
                    <FormControl>
                       <WhatsAppMessagePreview content={field.value} />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground mt-2">
                      AI-generated variation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="field3"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel className="font-semibold text-foreground mb-2">WhatsApp Variation 3</FormLabel>
                    <FormControl>
                       <WhatsAppMessagePreview content={field.value} />
                    </FormControl>
                     <FormDescription className="text-xs text-muted-foreground mt-2">
                      AI-generated variation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <TemplateGallery onTemplateClick={handleTemplateSelect} />
        </Card>
      </form>
    </Form>
  );
}

export default FormFlowFields;

    