-- Enable row level security for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert their own data
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
CREATE POLICY "Users can insert their own data"
ON users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Create policy to allow users to read their own data
DROP POLICY IF EXISTS "Users can read their own data" ON users;
CREATE POLICY "Users can read their own data"
ON users FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Create policy to allow users to update their own data
DROP POLICY IF EXISTS "Users can update their own data" ON users;
CREATE POLICY "Users can update their own data"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Create policy to allow service role to access all data
DROP POLICY IF EXISTS "Service role can do anything" ON users;
CREATE POLICY "Service role can do anything"
ON users
TO service_role
USING (true);

-- Add to realtime publication
alter publication supabase_realtime add table users;