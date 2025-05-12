
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { suggestFormFields, type SuggestFormFieldsOutput } from "@/ai/flows/form-suggestion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Input } from "@/components/ui/input"; // Kept for context field
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  field1: z
    .string()
    .max(50, "Field 1 must be 50 characters or less.")
    .optional()
    .describe("AI-generated content for Field 1."),
  field2: z
    .string()
    .max(50, "Field 2 must be 50 characters or less.")
    .optional()
    .describe("AI-generated content for Field 2."),
  field3: z
    .string()
    .max(50, "Field 3 must be 50 characters or less.")
    .optional()
    .describe("AI-generated content for Field 3."),
  context: z.string().optional(),
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

  const onSubmit = (values: FormValues) => {
    console.log("Form submitted:", values);
    toast({
      title: "Form Submitted!",
      description: "Your data has been successfully processed.",
    });
    // Optionally, reset the form:
    // form.reset();
  };

  const handleGetSuggestions = useCallback(async () => {
    setIsLoadingSuggestions(true);
    const currentValues = form.getValues();
    try {
      const result = await suggestFormFields({
        field1: currentValues.field1 || "", // Pass current value or empty string
        field2: currentValues.field2 || "", // Pass current value or empty string
        field3: currentValues.field3 || "", // Pass current value or empty string
        context: currentValues.context || "General context",
      });
      
      form.setValue('field1', result.suggestion1, { shouldValidate: true });
      form.setValue('field2', result.suggestion2, { shouldValidate: true });
      form.setValue('field3', result.suggestion3, { shouldValidate: true });

      toast({
        title: "AI Suggestions Loaded!",
        description: "Form fields have been updated with AI suggestions.",
      });
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      toast({
        title: "Error",
        description: "Failed to load AI suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [form, toast]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="shadow-xl rounded-xl bg-card">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary">
              Describe Your Needs
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Provide context and let AI generate the details for Field 1, 2, and 3.
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
                      placeholder="Provide some context for the AI (e.g., 'User is planning a new software project.')"
                      className="resize-none rounded-md shadow-sm focus:ring-accent focus:border-accent text-base"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-muted-foreground">
                    This context helps the AI provide more relevant suggestions for the fields below.
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
                    <FormLabel className="font-semibold">Field 1</FormLabel>
                    <FormControl>
                      <div className="flex items-center h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm">
                        {field.value ? (
                          <span className="truncate">{field.value}</span>
                        ) : (
                          <span className="text-muted-foreground">AI suggestion...</span>
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
                    <FormLabel className="font-semibold">Field 2</FormLabel>
                    <FormControl>
                       <div className="flex items-center h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm">
                        {field.value ? (
                          <span className="truncate">{field.value}</span>
                        ) : (
                          <span className="text-muted-foreground">AI suggestion...</span>
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
                    <FormLabel className="font-semibold">Field 3</FormLabel>
                    <FormControl>
                       <div className="flex items-center h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm">
                        {field.value ? (
                           <span className="truncate">{field.value}</span>
                        ) : (
                          <span className="text-muted-foreground">AI suggestion...</span>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-border mt-6">
            <Button 
              type="button" 
              onClick={handleGetSuggestions} 
              disabled={isLoadingSuggestions} 
              variant="outline"
              className="w-full sm:w-auto rounded-md shadow-sm hover:bg-accent/10"
            >
              {isLoadingSuggestions ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Suggestions...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4 text-accent" />
                  Get AI Suggestions
                </>
              )}
            </Button>
            <Button 
              type="submit" 
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-md shadow-md" 
              disabled={isLoadingSuggestions}
            >
              <Send className="mr-2 h-4 w-4" />
              Submit Form
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export default FormFlowFields;
