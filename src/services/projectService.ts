import { supabase } from '@/lib/supabase';
import { Project, ProjectImage } from '@/types';

// Get all projects
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('updatedAt', { ascending: false });
  
  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  
  return data || [];
}

// Get projects for a specific homeowner
export async function getHomeownerProjects(homeownerId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('homeownerId', homeownerId)
    .order('updatedAt', { ascending: false });
  
  if (error) {
    console.error('Error fetching homeowner projects:', error);
    return [];
  }
  
  return data || [];
}

// Get a single project by ID
export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }
  
  return data;
}

// Create a new project
export async function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project | null> {
  const newProject = {
    ...project,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const { data, error } = await supabase
    .from('projects')
    .insert(newProject)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating project:', error);
    return null;
  }
  
  return data;
}

// Update an existing project
export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .update({
      ...updates,
      updatedAt: new Date(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating project:', error);
    return null;
  }
  
  return data;
}

// Delete a project
export async function deleteProject(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }
  
  return true;
} 