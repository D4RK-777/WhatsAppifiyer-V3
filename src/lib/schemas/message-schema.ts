import { z } from 'zod';

export const messageTypeSchema = z.enum([
  'standard',
  'image',
  'video',
  'pdf',
  'carousel',
  'catalog'
]);

export const toneSchema = z.enum([
  'professional',
  'friendly',
  'empathetic',
  'cheeky',
  'sincere',
  'urgent'
]);

export const purposeSchema = z.enum([
  'marketing',
  'transactional',
  'alert',
  'support',
  'educational',
  'event',
  'authentication'
]);

export const messageFormSchema = z.object({
  messageType: messageTypeSchema,
  tone: toneSchema,
  purpose: purposeSchema,
  header: z.string().max(60, 'Header must be 60 characters or less').optional(),
  body: z.string()
    .min(1, 'Message body is required')
    .max(1024, 'Message body must be 1024 characters or less'),
  footer: z.string().max(60, 'Footer must be 60 characters or less').optional(),
  buttonText: z.string().max(25, 'Button text must be 25 characters or less').optional(),
  buttonUrl: z.string().url('Please enter a valid URL').optional(),
  mediaUrl: z.string().url('Please enter a valid URL').optional(),
  mediaCaption: z.string().max(3000, 'Caption must be 3000 characters or less').optional()
});

export type MessageFormValues = z.infer<typeof messageFormSchema>;
