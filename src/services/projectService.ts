import { supabase, supabaseAdmin } from '@/lib/supabase';
import { Project, ProjectImage } from '@/types';
import { mockProjects } from '@/data/mockData';

// Get all projects
export async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('updatedAt', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error);
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    throw error;
  }
}

// Get projects for a specific homeowner
export async function getHomeownerProjects(homeownerId: string): Promise<Project[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('homeownerId', homeownerId)
      .order('updatedAt', { ascending: false });
    
    if (error) {
      console.error('Error fetching homeowner projects:', error);
      throw new Error(`Failed to fetch homeowner projects: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    throw error;
  }
}

// Get projects for a specific builder
export async function getBuilderProjects(builderId: string): Promise<Project[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('builderId', builderId)
      .order('updatedAt', { ascending: false });
    
    if (error) {
      console.error('Error fetching builder projects:', error);
      throw new Error(`Failed to fetch builder projects: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    throw error;
  }
}

// Get a single project by ID
export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching project:', error);
      throw new Error(`Failed to fetch project: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    throw error;
  }
}

// Create a new project
export async function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project | null> {
  try {
    // Prepare the project data for Supabase
    const newProject = {
      ...project,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Ensure thumbnail is set to a default value if not provided
      thumbnail: project.thumbnail || null,
    };
    
    console.log('Creating project with data:', newProject);
    
    // Use supabaseAdmin to bypass RLS policies
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert(newProject)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating project in Supabase:', error);
      throw new Error(`Failed to create project: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    throw error;
  }
}

// Update an existing project
export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating project in Supabase:', error);
      throw new Error(`Failed to update project: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    throw error;
  }
}

// Delete a project
export async function deleteProject(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting project in Supabase:', error);
      throw new Error(`Failed to delete project: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    throw error;
  }
}

// Update project thumbnail
export async function updateProjectThumbnail(projectId: string, thumbnailUrl: string): Promise<Project | null> {
  try {
    console.log('Updating project thumbnail:', { projectId, thumbnailUrl });
    
    const { data, error } = await supabaseAdmin
      .from('projects')
      .update({
        thumbnail: thumbnailUrl,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', projectId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating project thumbnail:', error);
      throw new Error(`Failed to update project thumbnail: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    throw error;
  }
} 