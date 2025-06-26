'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { messageFormSchema, MessageFormValues } from '@/lib/schemas/message-schema';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageTypeSelector } from './message-type-selector';
import { ToneSelector } from './tone-selector';
import { PurposeSelector } from './purpose-selector';
import { CharacterCounter } from './character-counter';

const truncateString = (str: string, num: number) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
};

export function MessageForm() {
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      messageType: 'standard',
      tone: 'friendly',
      purpose: 'marketing',
      body: '',
    },
  });

  const messageType = form.watch('messageType');
  const body = form.watch('body') || '';
  const header = form.watch('header') || '';
  const footer = form.watch('footer') || '';
  const mediaCaption = truncateString(form.watch('mediaCaption') || '', 1024);
  const buttonText = form.watch('buttonText') || '';

  const onSubmit = (data: MessageFormValues) => {
    console.log('Form submitted:', data);
    // Handle form submission
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="messageType"
            render={({ field }) => (
              <FormItem>
                <MessageTypeSelector value={field.value} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tone"
            render={({ field }) => (
              <FormItem>
                <ToneSelector value={field.value} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <PurposeSelector value={field.value} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="header"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div>
                  <Input 
                    placeholder="Message header (optional)" 
                    {...field} 
                    value={field.value || ''}
                  />
                  <CharacterCounter current={header.length} max={60} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div>
                  <Textarea 
                    placeholder="Write your message here..." 
                    className="min-h-[150px]"
                    {...field} 
                  />
                  <CharacterCounter current={body.length} max={1024} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {(messageType === 'image' || messageType === 'video') && (
          <FormField
            control={form.control}
            name="mediaUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    placeholder="Paste image or video URL" 
                    {...field} 
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {(messageType === 'image' || messageType === 'video') && (
          <FormField
            control={form.control}
            name="mediaCaption"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div>
                    <Textarea 
                      placeholder="Add a caption (optional)" 
                      {...field} 
                      value={field.value || ''}
                    />
                    <CharacterCounter current={mediaCaption.length} max={3000} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="buttonText"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div>
                    <Input 
                      placeholder="Button text (optional)" 
                      {...field} 
                      value={field.value || ''}
                    />
                    <CharacterCounter current={buttonText.length} max={25} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="buttonUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    placeholder="Button URL (optional)" 
                    {...field} 
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="footer"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div>
                  <Input 
                    placeholder="Footer text (optional)" 
                    {...field} 
                    value={field.value || ''}
                  />
                  <CharacterCounter current={footer.length} max={60} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" className="w-full md:w-auto">
            Generate Message
          </Button>
        </div>
      </form>
    </Form>
  );
}
