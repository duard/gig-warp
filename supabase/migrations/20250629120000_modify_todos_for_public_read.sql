-- Add user_id column to todos table
ALTER TABLE public.todos
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Enable Row Level Security
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own todos
CREATE POLICY "Enable insert for authenticated users only"
ON public.todos
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to view all todos
CREATE POLICY "Enable read access for all authenticated users"
ON public.todos
FOR SELECT
TO authenticated
USING (true);

-- Allow users to update their own todos
CREATE POLICY "Enable update for users based on user_id"
ON public.todos
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own todos
CREATE POLICY "Enable delete for users based on user_id"
ON public.todos
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
