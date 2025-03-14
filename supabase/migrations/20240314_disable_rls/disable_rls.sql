-- Disable RLS on projects table for development
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- Disable RLS on users table for development
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Disable RLS on project_images table for development
ALTER TABLE project_images DISABLE ROW LEVEL SECURITY; 