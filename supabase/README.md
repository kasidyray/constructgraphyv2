# Supabase Setup Instructions

This document provides instructions for setting up Supabase for this project.

## Fixing RLS (Row Level Security) Issues

There are two ways to fix RLS issues:

### Option 1: Disable RLS for Development (Quick Solution)

1. Run the migration script to disable RLS:
   ```bash
   cd supabase
   ./apply_migrations.sh
   ```

2. This will apply the SQL in `migrations/20240314_disable_rls/disable_rls.sql` which disables RLS on all tables.

### Option 2: Use Service Role Key (Recommended for Development)

1. Get your service role key from the Supabase dashboard:
   - Go to your Supabase project
   - Navigate to Project Settings > API
   - Copy the `service_role` key (NOT the anon key)

2. Add it to your `.env.local` file:
   ```
   VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. Restart your development server.

## Proper RLS Setup for Production

For production, you should:

1. Enable RLS on all tables
2. Create proper RLS policies based on authenticated users
3. Implement authentication
4. Use the service role key only for admin operations on the server side

Example RLS policies for the projects table:

```sql
-- Allow users to select their own projects
CREATE POLICY "Users can view their own projects" 
ON projects FOR SELECT 
USING (
  auth.uid() = "homeownerId" OR 
  auth.uid() = "builderId" OR
  auth.role() = 'admin'
);

-- Allow users to insert their own projects
CREATE POLICY "Users can insert their own projects" 
ON projects FOR INSERT 
WITH CHECK (
  auth.uid() = "homeownerId" OR 
  auth.role() = 'admin'
);

-- Allow users to update their own projects
CREATE POLICY "Users can update their own projects" 
ON projects FOR UPDATE 
USING (
  auth.uid() = "homeownerId" OR 
  auth.uid() = "builderId" OR
  auth.role() = 'admin'
);

-- Allow users to delete their own projects
CREATE POLICY "Users can delete their own projects" 
ON projects FOR DELETE 
USING (
  auth.uid() = "homeownerId" OR 
  auth.role() = 'admin'
);
``` 