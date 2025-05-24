-- Enable Row Level Security
ALTER SYSTEM SET pgsodium.getkey_retries = 10;

-- Create message_feedback table
CREATE TABLE IF NOT EXISTS public.message_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_positive BOOLEAN NOT NULL,
  feedback_text TEXT,
  message_content TEXT NOT NULL,
  message_metadata JSONB DEFAULT '{}'::jsonb,
  formatting_analysis JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_message_feedback_message_id ON public.message_feedback(message_id);
CREATE INDEX IF NOT EXISTS idx_message_feedback_user_id ON public.message_feedback(user_id);

-- Create message_metadata table for additional message analytics
CREATE TABLE IF NOT EXISTS public.message_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id TEXT NOT NULL UNIQUE,
  message_type TEXT,
  message_tone TEXT,
  word_count INTEGER,
  has_emojis BOOLEAN DEFAULT FALSE,
  has_links BOOLEAN DEFAULT FALSE,
  has_code_blocks BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_message_metadata_message_id ON public.message_metadata(message_id);

-- Create a view for AI training data
CREATE OR REPLACE VIEW public.ai_training_data AS
SELECT 
  mf.id,
  mf.message_id,
  mf.message_content,
  mf.is_positive,
  mf.feedback_text,
  mf.formatting_analysis,
  mm.message_type,
  mm.message_tone,
  mm.word_count,
  mm.has_emojis,
  mm.has_links,
  mm.has_code_blocks,
  mf.created_at
FROM 
  public.message_feedback mf
LEFT JOIN 
  public.message_metadata mm ON mf.message_id = mm.message_id;

-- Set up Row Level Security (RLS)
ALTER TABLE public.message_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_metadata ENABLE ROW LEVEL SECURITY;

-- RLS Policies for message_feedback
CREATE POLICY "Users can view their own feedback"
  ON public.message_feedback
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback"
  ON public.message_feedback
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own feedback"
  ON public.message_feedback
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for message_metadata
CREATE POLICY "Enable read access for all users"
  ON public.message_metadata
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users only"
  ON public.message_metadata
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update timestamps
CREATE TRIGGER update_message_feedback_updated_at
BEFORE UPDATE ON public.message_feedback
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_message_metadata_updated_at
BEFORE UPDATE ON public.message_metadata
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANTANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
