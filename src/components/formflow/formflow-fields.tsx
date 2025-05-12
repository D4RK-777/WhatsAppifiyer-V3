
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod"; // Corrected import for z

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  field1: z
    .string()
    .min(1, "Field 1 is required.")
    .max(50, "Field 1 must be 50 characters or less."),
  field2: z
    .string()
    .min(1, "Field 2 is required.")
    .max(50, "Field 2 must be 50 characters or less."),
  field3: z
    .string()
    .min(1, "Field 3 is required.")
    .max(50, "Field 3 must be 50 characters or less."),
  context: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function FormFlowFields() {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<SuggestFormFieldsOutput | null>(null);
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
    // Here you would typically send the data to a backend or perform other actions.
    // For now, we just log it and show a toast.
    // Optionally, reset the form:
    // form.reset();
    // setSuggestions(null);
  };

  const handleGetSuggestions = useCallback(async () => {
    setIsLoadingSuggestions(true);
    setSuggestions(null); // Clear previous suggestions
    const currentValues = form.getValues();
    try {
      const result = await suggestFormFields({
        field1: currentValues.field1,
        field2: currentValues.field2,
        field3: currentValues.field3,
        context: currentValues.context || "General context", // Provide default context if empty
      });
      setSuggestions(result);
      toast({
        title: "AI Suggestions Loaded!",
        description: "New suggestions are available for your form fields.",
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
              Fill in the details below. Use the AI suggestions to help you out!
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
                      <Input 
                        placeholder="Enter value for Field 1" 
                        {...field} 
                        className="rounded-md shadow-sm focus:ring-accent focus:border-accent"
                      />
                    </FormControl>
                    {suggestions?.suggestion1 && (
                       <FormDescription className="text-primary italic pt-1">
                        Suggestion: {suggestions.suggestion1}
                       </FormDescription>
                    )}
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
                      <Input 
                        placeholder="Enter value for Field 2" 
                        {...field} 
                        className="rounded-md shadow-sm focus:ring-accent focus:border-accent"
                      />
                    </FormControl>
                     {suggestions?.suggestion2 && (
                       <FormDescription className="text-primary italic pt-1">
                        Suggestion: {suggestions.suggestion2}
                       </FormDescription>
                    )}
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
                      <Input 
                        placeholder="Enter value for Field 3" 
                        {...field} 
                        className="rounded-md shadow-sm focus:ring-accent focus:border-accent"
                      />
                    </FormControl>
                     {suggestions?.suggestion3 && (
                       <FormDescription className="text-primary italic pt-1">
                        Suggestion: {suggestions.suggestion3}
                       </FormDescription>
                    )}
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
