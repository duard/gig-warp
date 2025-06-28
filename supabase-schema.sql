-- Create todos table
CREATE TABLE IF NOT EXISTS public.todos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    title text NOT NULL,
    description text,
    completed boolean DEFAULT false NOT NULL,
    user_id uuid REFERENCES auth.users NOT NULL,
    due_date timestamp with time zone,
    priority text CHECK (priority IN ('low', 'medium', 'high'))
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see/edit their own todos
CREATE POLICY "Users can view their own todos" ON public.todos
    FOR ALL USING (auth.uid() = user_id);

-- Create policy: Users can insert their own todos
CREATE POLICY "Users can insert their own todos" ON public.todos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own todos
CREATE POLICY "Users can update their own todos" ON public.todos
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policy: Users can delete their own todos
CREATE POLICY "Users can delete their own todos" ON public.todos
    FOR DELETE USING (auth.uid() = user_id);

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS todos_user_id_idx ON public.todos(user_id);
CREATE INDEX IF NOT EXISTS todos_created_at_idx ON public.todos(created_at);
