
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import TemplateGallery, { type TemplateItemProps } from "./template-gallery";
import { suggestFormFields, type SuggestFormFieldsInput, type SuggestFormFieldsOutput } from "@/ai/flows/form-suggestion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";


const formSchema = z.object({
  field1: z
    .string()
    .max(500, "Field 1 must be 500 characters or less.") // Increased max length for WhatsApp messages
    .optional()
    .describe("AI-generated content for Field 1, WhatsApp formatted."),
  field2: z
    .string()
    .max(500, "Field 2 must be 500 characters or less.") // Increased max length
    .optional()
    .describe("AI-generated content for Field 2, WhatsApp formatted."),
  field3: z
    .string()
    .max(500, "Field 3 must be 500 characters or less.") // Increased max length
    .optional()
    .describe("AI-generated content for Field 3, WhatsApp formatted."),
  context: z.string().min(1, "Context cannot be empty.").max(500, "Context must be 500 characters or less."),
});

type FormValues = z.infer<typeof formSchema>;

function FormFlowFields() {
  const { toast } = useToast();
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      field1: "",
      field2: "",
      field3: "",
      context: "",
    },
  });

  const handleTemplateSelect = (template: TemplateItemProps) => {
    form.setValue("context", template.dataAiHint, { shouldValidate: true });
    form.setValue("field1", template.templateContent.field1 || "", { shouldValidate: true });
    form.setValue("field2", template.templateContent.field2 || "", { shouldValidate: true });
    form.setValue("field3", template.templateContent.field3 || "", { shouldValidate: true });
    toast({
      title: `Template "${template.title}" Applied!`,
      description: "Context and fields pre-populated. Edit or get AI suggestions.",
    });
  };

  const handleGetSuggestions = async () => {
    const { context, field1, field2, field3 } = form.getValues();
    if (!context.trim()) {
      form.setError("context", { type: "manual", message: "Please provide some context or select a template." });
      return;
    }
    form.clearErrors("context");


    setIsLoadingSuggestions(true);
    try {
      const suggestions: SuggestFormFieldsOutput = await suggestFormFields({
        context,
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
              Select a template or provide context and initial text. Then, get AI-powered WhatsApp formatted suggestions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Context / Goal</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="E.g., 'Marketing campaign for new shoes', 'OTP for login', or select a template below."
                      className="resize-none rounded-md shadow-sm text-base focus-visible:ring-0 focus-visible:shadow-[0_0_10px_hsl(var(--accent)_/_0.7)]"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-muted-foreground">
                    This context guides the AI for WhatsApp message generation.
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
                    <FormLabel className="font-semibold text-primary/90">Message Part 1 / Suggestion 1</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter initial text for message part 1 or let AI generate it."
                        className="resize-none rounded-md shadow-sm text-base min-h-[100px] focus-visible:ring-0 focus-visible:shadow-[0_0_10px_hsl(var(--accent)_/_0.7)]"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                     <FormDescription className="text-xs text-muted-foreground">
                      This field will be transformed into a WhatsApp message suggestion.
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
                    <FormLabel className="font-semibold text-primary/90">Message Part 2 / Suggestion 2</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter initial text for message part 2 or let AI generate it."
                        className="resize-none rounded-md shadow-sm text-base min-h-[100px] focus-visible:ring-0 focus-visible:shadow-[0_0_10px_hsl(var(--accent)_/_0.7)]"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      This field will be transformed into a WhatsApp message suggestion.
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
                    <FormLabel className="font-semibold text-primary/90">Message Part 3 / Suggestion 3</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter initial text for message part 3 or let AI generate it."
                        className="resize-none rounded-md shadow-sm text-base min-h-[100px] focus-visible:ring-0 focus-visible:shadow-[0_0_10px_hsl(var(--accent)_/_0.7)]"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                     <FormDescription className="text-xs text-muted-foreground">
                      This field will be transformed into a WhatsApp message suggestion.
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
