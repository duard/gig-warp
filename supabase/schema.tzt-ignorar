-- MyTabsApp Database Schema for Supabase
-- Run these commands in your Supabase SQL Editor

-- Enable Row Level Security
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.checklist_items ENABLE ROW LEVEL SECURITY;

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  phone TEXT,
  preferences JSONB DEFAULT '{"theme": "system", "notifications": true, "language": "en"}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create checklists table
CREATE TABLE IF NOT EXISTS public.checklists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#007AFF',
  is_public BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create checklist_items table
CREATE TABLE IF NOT EXISTS public.checklist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  checklist_id UUID REFERENCES public.checklists ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS handle_updated_at_profiles ON public.profiles;
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_checklists ON public.checklists;
CREATE TRIGGER handle_updated_at_checklists
  BEFORE UPDATE ON public.checklists
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_checklist_items ON public.checklist_items;
CREATE TRIGGER handle_updated_at_checklist_items
  BEFORE UPDATE ON public.checklist_items
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Row Level Security Policies

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

-- Checklists policies
DROP POLICY IF EXISTS "Users can view their own checklists" ON public.checklists;
CREATE POLICY "Users can view their own checklists" ON public.checklists
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

DROP POLICY IF EXISTS "Users can create their own checklists" ON public.checklists;
CREATE POLICY "Users can create their own checklists" ON public.checklists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own checklists" ON public.checklists;
CREATE POLICY "Users can update their own checklists" ON public.checklists
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own checklists" ON public.checklists;
CREATE POLICY "Users can delete their own checklists" ON public.checklists
  FOR DELETE USING (auth.uid() = user_id);

-- Checklist items policies
DROP POLICY IF EXISTS "Users can view their own checklist items" ON public.checklist_items;
CREATE POLICY "Users can view their own checklist items" ON public.checklist_items
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own checklist items" ON public.checklist_items;
CREATE POLICY "Users can create their own checklist items" ON public.checklist_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own checklist items" ON public.checklist_items;
CREATE POLICY "Users can update their own checklist items" ON public.checklist_items
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own checklist items" ON public.checklist_items;
CREATE POLICY "Users can delete their own checklist items" ON public.checklist_items
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(id);
CREATE INDEX IF NOT EXISTS checklists_user_id_idx ON public.checklists(user_id);
CREATE INDEX IF NOT EXISTS checklists_is_public_idx ON public.checklists(is_public);
CREATE INDEX IF NOT EXISTS checklist_items_checklist_id_idx ON public.checklist_items(checklist_id);
CREATE INDEX IF NOT EXISTS checklist_items_user_id_idx ON public.checklist_items(user_id);
CREATE INDEX IF NOT EXISTS checklist_items_completed_idx ON public.checklist_items(completed);
