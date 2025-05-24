-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp" with schema extensions;

-- Create message_metadata table
create table if not exists message_metadata (
  id uuid primary key default uuid_generate_v4(),
  original_message text not null,
  message_type varchar(50),
  media_type varchar(50),
  tone varchar(50),
  created_at timestamptz default now()
);

-- Create message_feedback table
create table if not exists message_feedback (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  message_id uuid not null,
  is_positive boolean not null,
  feedback_text text,
  message_content text not null,
  message_metadata jsonb default '{}'::jsonb,
  formatting_analysis jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- Create index for faster lookups
create index if not exists idx_message_feedback_message_id on message_feedback(message_id);
create index if not exists idx_message_feedback_user_id on message_feedback(user_id);
create index if not exists idx_message_feedback_created_at on message_feedback(created_at);

-- Create RLS policies for message_feedback table
alter table message_feedback enable row level security;

-- Allow users to read their own feedback
create policy "Users can view their own feedback"
on message_feedback for select
using (auth.uid() = user_id);

-- Allow users to insert their own feedback
create policy "Users can create feedback"
on message_feedback for insert
with check (auth.uid() = user_id);

-- Allow users to update their own feedback
create policy "Users can update their own feedback"
on message_feedback for update
using (auth.uid() = user_id);

-- Create a view for AI training data
create or replace view ai_training_data as
select 
  mf.id as feedback_id,
  mf.message_id,
  mf.user_id,
  mf.is_positive,
  mf.feedback_text,
  mf.message_content,
  mf.message_metadata,
  mf.formatting_analysis,
  mf.created_at
from message_feedback mf;
