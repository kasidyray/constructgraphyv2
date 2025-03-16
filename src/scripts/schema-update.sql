-- Step 1: Update foreign key constraints to reference profiles instead of users

-- Update projects table to reference profiles
ALTER TABLE public.projects 
DROP CONSTRAINT IF EXISTS "projects_homeownerId_fkey",
ADD CONSTRAINT "projects_homeownerId_fkey" 
FOREIGN KEY ("homeownerId") REFERENCES public.profiles(id);

ALTER TABLE public.projects 
DROP CONSTRAINT IF EXISTS "projects_builderId_fkey",
ADD CONSTRAINT "projects_builderId_fkey" 
FOREIGN KEY ("builderId") REFERENCES public.profiles(id);

-- Update user_favourites table to reference profiles
ALTER TABLE public.user_favourites 
DROP CONSTRAINT IF EXISTS "user_favourites_userId_fkey",
ADD CONSTRAINT "user_favourites_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES public.profiles(id);

-- Step 2: Drop the users table
DROP TABLE IF EXISTS public.users;

-- Step 3: Add any missing columns to profiles if needed
-- For example, if we need to add first_name and last_name columns:
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Step 4: Create a trigger to automatically create profiles when auth users are created
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, "createdAt")
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'homeowner'),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 