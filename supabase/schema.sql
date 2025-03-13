-- Drop existing tables if they exist
DROP TABLE IF EXISTS project_images;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table with properly quoted camelCase column names
CREATE TABLE IF NOT EXISTS users (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "email" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "role" TEXT NOT NULL CHECK ("role" IN ('admin', 'builder', 'homeowner')),
  "avatar" TEXT,
  "phone" TEXT,
  "builderId" UUID REFERENCES users("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table with properly quoted camelCase column names
CREATE TABLE IF NOT EXISTS projects (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "status" TEXT NOT NULL CHECK ("status" IN ('planning', 'in-progress', 'completed', 'on-hold')),
  "homeownerId" UUID NOT NULL REFERENCES users("id"),
  "homeownerName" TEXT NOT NULL,
  "builderId" UUID REFERENCES users("id"),
  "thumbnail" TEXT,
  "progress" INTEGER NOT NULL DEFAULT 0 CHECK ("progress" >= 0 AND "progress" <= 100),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_images table with properly quoted camelCase column names
CREATE TABLE IF NOT EXISTS project_images (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "projectId" UUID NOT NULL REFERENCES projects("id") ON DELETE CASCADE,
  "url" TEXT NOT NULL,
  "caption" TEXT,
  "category" TEXT NOT NULL CHECK ("category" IN ('interior', 'exterior', 'structural', 'finishes', 'other', 'general')),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for project images
-- Note: This needs to be done in the Supabase dashboard or via the API

-- Create RLS policies
-- These are basic policies that allow all operations for now
-- In a real app, you would want to restrict these based on user roles

-- Users table policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);

-- Projects table policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true);

-- Project images table policies
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on project_images" ON project_images FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_homeowner_id ON projects("homeownerId");
CREATE INDEX IF NOT EXISTS idx_projects_builder_id ON projects("builderId");
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images("projectId");

-- Insert some sample data for testing
INSERT INTO users ("id", "email", "name", "role", "avatar")
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@example.com', 'Admin User', 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'),
  ('00000000-0000-0000-0000-000000000002', 'builder@example.com', 'Builder User', 'builder', 'https://api.dicebear.com/7.x/avataaars/svg?seed=builder'),
  ('00000000-0000-0000-0000-000000000003', 'homeowner@example.com', 'Homeowner User', 'homeowner', 'https://api.dicebear.com/7.x/avataaars/svg?seed=homeowner')
ON CONFLICT ("id") DO NOTHING; 