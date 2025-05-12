
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
  // isLoadingSuggestions and handleGetSuggestions are removed as the button is removed.

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
      description: "Your data has been successfully processed. (Note: Submit button removed, this might be triggered by Enter in Textarea)",
    });
  };

  // handleGetSuggestions logic removed

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="shadow-xl rounded-xl bg-card">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary">
              Describe Your Needs
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Provide context for the form. Fields 1, 2, and 3 will display content.
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
                      className="resize-none rounded-md shadow-sm focus:ring-accent focus:border-accent text-base"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-muted-foreground">
                    This context can be used to guide the content of the fields below.
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
                          <span className="text-muted-foreground">Output for Field 1...</span>
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
                          <span className="text-muted-foreground">Output for Field 2...</span>
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
                          <span className="text-muted-foreground">Output for Field 3...</span>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <TemplateGallery /> {/* Replaced CardFooter */}
        </Card>
      </form>
    </Form>
  );
}

export default FormFlowFields;
