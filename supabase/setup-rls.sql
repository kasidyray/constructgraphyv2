-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- Create a function to get the current user's role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Create a function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT get_user_role() = 'admin';
$$ LANGUAGE sql SECURITY DEFINER;

-- Create a function to check if the current user is a builder
CREATE OR REPLACE FUNCTION public.is_builder()
RETURNS BOOLEAN AS $$
  SELECT get_user_role() = 'builder';
$$ LANGUAGE sql SECURITY DEFINER;

-- Create a function to check if the current user is a homeowner
CREATE OR REPLACE FUNCTION public.is_homeowner()
RETURNS BOOLEAN AS $$
  SELECT get_user_role() = 'homeowner';
$$ LANGUAGE sql SECURITY DEFINER;

-- Users table policies
-- Admins can do anything
CREATE POLICY "Admins can do anything with users" ON public.users
  USING (is_admin())
  WITH CHECK (is_admin());

-- Users can read their own profile
CREATE POLICY "Users can read their own profile" ON public.users
  FOR SELECT
  USING (id = auth.uid());

-- Projects table policies
-- Admins can do anything
CREATE POLICY "Admins can do anything with projects" ON public.projects
  USING (is_admin())
  WITH CHECK (is_admin());

-- Builders can read all projects and update projects assigned to them
CREATE POLICY "Builders can read all projects" ON public.projects
  FOR SELECT
  USING (is_builder());

CREATE POLICY "Builders can update their assigned projects" ON public.projects
  FOR UPDATE
  USING (is_builder() AND builderId = (SELECT id FROM public.users WHERE id = auth.uid()));

-- Homeowners can read and update their own projects
CREATE POLICY "Homeowners can read their own projects" ON public.projects
  FOR SELECT
  USING (is_homeowner() AND homeownerId = auth.uid());

-- Project images table policies
-- Admins can do anything
CREATE POLICY "Admins can do anything with project images" ON public.project_images
  USING (is_admin())
  WITH CHECK (is_admin());

-- Builders can read all project images and create/update/delete images for their assigned projects
CREATE POLICY "Builders can read all project images" ON public.project_images
  FOR SELECT
  USING (is_builder());

CREATE POLICY "Builders can create images for their assigned projects" ON public.project_images
  FOR INSERT
  WITH CHECK (
    is_builder() AND 
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = project_images.projectId 
      AND projects.builderId = (SELECT id FROM public.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Builders can update images for their assigned projects" ON public.project_images
  FOR UPDATE
  USING (
    is_builder() AND 
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = project_images.projectId 
      AND projects.builderId = (SELECT id FROM public.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Builders can delete images for their assigned projects" ON public.project_images
  FOR DELETE
  USING (
    is_builder() AND 
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = project_images.projectId 
      AND projects.builderId = (SELECT id FROM public.users WHERE id = auth.uid())
    )
  );

-- Homeowners can read images for their own projects
CREATE POLICY "Homeowners can read images for their own projects" ON public.project_images
  FOR SELECT
  USING (
    is_homeowner() AND 
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = project_images.projectId 
      AND projects.homeownerId = auth.uid()
    )
  ); 