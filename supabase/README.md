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

# Supabase Auth Setup

This directory contains scripts and SQL files to set up Supabase Auth for the Constructography application.

## Prerequisites

1. A Supabase project with the following tables:
   - `users`
   - `projects`
   - `project_images`

2. Environment variables in `.env.local`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_SERVICE_ROLE_KEY`

## Setup Steps

### 1. Create Auth Users

First, we need to create Supabase Auth users for our existing users in the database:

```bash
# Install dependencies
npm install dotenv @supabase/supabase-js

# Run the script
node -r dotenv/config src/scripts/create-auth-users.js
```

This script will:
- Fetch all users from the `users` table
- Create corresponding Auth users with the same IDs
- **Note:** Passwords are not hardcoded here for security. They should be set securely during seeding or users prompted to reset.

### 2. Apply Row Level Security (RLS) Policies

Next, we need to apply RLS policies to our tables to ensure proper access control:

```bash
# Make the script executable
chmod +x supabase/apply-rls.sh

# Run the script
./supabase/apply-rls.sh
```

This script will apply the RLS policies defined in `setup-rls.sql` to your Supabase project.

## RLS Policies

The RLS policies implement the following access control rules:

### Users Table
- Admins can do anything with users
- Users can read their own profile

### Projects Table
- Admins can do anything with projects
- Builders can read all projects
- Builders can update projects assigned to them
- Homeowners can read their own projects

### Project Images Table
- Admins can do anything with project images
- Builders can read all project images
- Builders can create/update/delete images for their assigned projects
- Homeowners can read images for their own projects

## Testing

After setting up Supabase Auth, you can test the login functionality with the following demo accounts:

- Admin: `admin@consto.com` / `password123`
- Builder: `builder@consto.com` / `password123`
- Homeowner: `homeowner@consto.com` / `password123`

## Troubleshooting

If you encounter any issues:

1. Check the browser console for errors
2. Verify that your environment variables are correctly set
3. Ensure that the RLS policies have been applied correctly
4. Check that the Auth users have been created with the correct IDs 