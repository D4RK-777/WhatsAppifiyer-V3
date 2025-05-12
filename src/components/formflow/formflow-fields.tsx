"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
    .max(500, "Suggestion 1 must be 500 characters or less.")
    .optional()
    .describe("AI-generated content for Suggestion 1, WhatsApp formatted."),
  field2: z
    .string()
    .max(500, "Suggestion 2 must be 500 characters or less.")
    .optional()
    .describe("AI-generated content for Suggestion 2, WhatsApp formatted."),
  field3: z
    .string()
    .max(500, "Suggestion 3 must be 500 characters or less.")
    .optional()
    .describe("AI-generated content for Suggestion 3, WhatsApp formatted."),
});

type FormValues = z.infer<typeof formSchema>;

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
    form.setValue("field2", template.templateContent.field2 || "", { shouldValidate: true });
    form.setValue("field3", template.templateContent.field3 || "", { shouldValidate: true });
    toast({
      title: `Template "${template.title}" Applied!`,
      description: "Text/Idea, message type, and fields pre-populated. Edit or get AI suggestions.",
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
      const suggestions: SuggestFormFieldsOutput = await suggestFormFields({
        context: yourTextOrIdea, // 'context' in AI flow maps to 'yourTextOrIdea' here
        messageType,
        field1: field1 || "",
        field2: field2 || "",
        field3: field3 || "",
      });
      form.setValue("field1", suggestions.suggestion1, { shouldValidate: true });
      form.setValue("field2", suggestions.suggestion2, { shouldValidate: true });
      form.setValue("field3", suggestions.suggestion3, { shouldValidate: true });
      toast({
        title: "Suggestions Loaded!",
        description: "AI-powered WhatsApp suggestions populated.",
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
    console.log("Form submitted (WhatsAppified):", values);
    toast({
      title: "Form Submitted!",
      description: "Your WhatsApp-ified data has been processed.",
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
              Enter your text or an idea, select a message type, then get AI-powered WhatsApp formatted suggestions. Or, pick a template!
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
                      placeholder="Paste your SMS or text here, or describe your message (e.g., 'Weekend sale announcement for shoes'). You can also select a template below."
                      className="resize-none rounded-md shadow-sm text-base focus-visible:ring-0 focus-visible:shadow-[0_0_10px_hsl(var(--accent)_/_0.7)]"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-muted-foreground">
                    This text or idea will be transformed by the AI.
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <FormField
                control={form.control}
                name="field1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-primary/90">Suggestion 1</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="AI-generated WhatsApp message suggestion 1 will appear here."
                        className="resize-none rounded-md shadow-sm text-base min-h-[100px] focus-visible:ring-0 focus-visible:shadow-[0_0_10px_hsl(var(--accent)_/_0.7)]"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                     <FormDescription className="text-xs text-muted-foreground">
                      Editable AI suggestion.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="field2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-primary/90">Suggestion 2</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="AI-generated WhatsApp message suggestion 2 will appear here."
                        className="resize-none rounded-md shadow-sm text-base min-h-[100px] focus-visible:ring-0 focus-visible:shadow-[0_0_10px_hsl(var(--accent)_/_0.7)]"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      Editable AI suggestion.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="field3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-primary/90">Suggestion 3</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="AI-generated WhatsApp message suggestion 3 will appear here."
                        className="resize-none rounded-md shadow-sm text-base min-h-[100px] focus-visible:ring-0 focus-visible:shadow-[0_0_10px_hsl(var(--accent)_/_0.7)]"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                     <FormDescription className="text-xs text-muted-foreground">
                      Editable AI suggestion.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
              <Button
                type="button"
                onClick={handleGetSuggestions}
                disabled={isLoadingSuggestions}
                className="px-8 py-3 text-base rounded-lg shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto"
              >
                {isLoadingSuggestions ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    WhatsAppifying...
                  </>
                ) : (
                  "Get AI WhatsApp Suggestions"
                )}
              </Button>
              <Button type="submit" className="px-10 py-3 text-lg rounded-lg shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto">
                Submit Form
              </Button>
            </div>
          </CardContent>
          <TemplateGallery onTemplateClick={handleTemplateSelect} />
        </Card>
      </form>
    </Form>
  );
}

export default FormFlowFields;
