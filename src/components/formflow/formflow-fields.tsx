
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
import TemplateGallery from "./template-gallery"; // Added import
import { suggestFormFields, type SuggestFormFieldsInput, type SuggestFormFieldsOutput } from "@/ai/flows/form-suggestion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";


const formSchema = z.object({
  field1: z
    .string()
    .max(150, "Field 1 must be 150 characters or less.") // Increased max length
    .optional()
    .describe("AI-generated content for Field 1."),
  field2: z
    .string()
    .max(150, "Field 2 must be 150 characters or less.") // Increased max length
    .optional()
    .describe("AI-generated content for Field 2."),
  field3: z
    .string()
    .max(150, "Field 3 must be 150 characters or less.") // Increased max length
    .optional()
    .describe("AI-generated content for Field 3."),
  context: z.string().min(1, "Context cannot be empty.").max(500, "Context must be 500 characters or less."), // Added validation
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

  const handleGetSuggestions = async () => {
    const { context, field1, field2, field3 } = form.getValues();
    if (!context.trim()) {
      form.setError("context", { type: "manual", message: "Please provide some context before generating suggestions." });
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
        description: "AI-powered suggestions have been populated.",
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
    console.log("Form submitted:", values);
    toast({
      title: "Form Submitted!",
      description: "Your data has been successfully processed.",
    });
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="shadow-xl rounded-xl bg-card">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary">
              Describe Your Needs
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Provide context for the form. Fields 1, 2, and 3 will display AI-generated content based on your input.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Context</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide some context (e.g., 'User is planning a new software project.')"
                      className="resize-none rounded-md shadow-sm text-base focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-muted-foreground">
                    This context will be used by the AI to generate content for the fields below.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center pt-2 pb-4">
              <Button
                type="button"
                onClick={handleGetSuggestions}
                disabled={isLoadingSuggestions}
                className="px-8 py-3 text-base rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                {isLoadingSuggestions ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Get AI Suggestions"
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <FormField
                control={form.control}
                name="field1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-primary/90">AI Output: Field 1</FormLabel>
                    <FormControl>
                      <div className="flex items-start p-3 min-h-[6rem] w-full rounded-md border border-input bg-secondary/30 text-sm shadow-sm break-words whitespace-pre-wrap">
                        {field.value ? (
                          <span className="text-foreground">{field.value}</span>
                        ) : (
                          <span className="text-muted-foreground italic">AI suggestion for Field 1 will appear here...</span>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="field2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-primary/90">AI Output: Field 2</FormLabel>
                    <FormControl>
                       <div className="flex items-start p-3 min-h-[6rem] w-full rounded-md border border-input bg-secondary/30 text-sm shadow-sm break-words whitespace-pre-wrap">
                        {field.value ? (
                          <span className="text-foreground">{field.value}</span>
                        ) : (
                          <span className="text-muted-foreground italic">AI suggestion for Field 2 will appear here...</span>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="field3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-primary/90">AI Output: Field 3</FormLabel>
                    <FormControl>
                       <div className="flex items-start p-3 min-h-[6rem] w-full rounded-md border border-input bg-secondary/30 text-sm shadow-sm break-words whitespace-pre-wrap">
                        {field.value ? (
                           <span className="text-foreground">{field.value}</span>
                        ) : (
                          <span className="text-muted-foreground italic">AI suggestion for Field 3 will appear here...</span>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <div className="flex justify-center pt-6">
                <Button type="submit" className="px-10 py-3 text-lg rounded-lg shadow-lg hover:shadow-xl transition-shadow">Submit Form</Button>
            </div>
          </CardContent>
          <TemplateGallery />
        </Card>
      </form>
    </Form>
  );
}

export default FormFlowFields;
