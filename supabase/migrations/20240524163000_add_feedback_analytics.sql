-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create feedback_tags table
CREATE TABLE IF NOT EXISTS public.feedback_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#6B7280',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create message_feedback_tags junction table
CREATE TABLE IF NOT EXISTS public.message_feedback_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id UUID REFERENCES public.message_feedback(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.feedback_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(feedback_id, tag_id)
);

-- Add some common tags
INSERT INTO public.feedback_tags (name, description, color) VALUES
  ('helpful', 'The message was helpful', '#10B981'),
  ('confusing', 'The message was confusing', '#F59E0B'),
  ('irrelevant', 'The message was irrelevant', '#EF4444'),
  ('needs_improvement', 'Needs improvement', '#3B82F6'),
  ('feature_request', 'Feature request', '#8B5CF6')
ON CONFLICT (name) DO NOTHING;

-- Add RLS policies
ALTER TABLE feedback_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_feedback_tags ENABLE ROW LEVEL SECURITY;

-- Allow public read access to tags
CREATE POLICY "Allow public read access to feedback_tags"
ON public.feedback_tags
FOR SELECT
USING (true);

-- Allow authenticated users to manage their feedback tags
CREATE POLICY "Allow users to manage their feedback tags"
ON public.message_feedback_tags
FOR ALL
USING (true)
WITH CHECK (true);
