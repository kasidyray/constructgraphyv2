import { supabase, supabaseAdmin } from '@/lib/supabase';
import { Project, ProjectImage, User } from '@/types';
import { mockProjects } from '@/data/mockData';
import { getUserById } from './userService';
import { sendProjectPhotosNotification } from './emailService';
import logger from '@/utils/logger';

// Get all projects
export async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      // Select all project fields and homeowner's first/last name from profiles
      .select('*, homeownerProfile:profiles!projects_homeownerId_fkey(first_name, last_name)')
      .order('updatedAt', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error);
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }
    
    // Map the fetched data to the Project type, including new fields
    return (data || []).map(p => ({
      ...p,
      homeownerFirstName: p.homeownerProfile?.first_name,
      homeownerLastName: p.homeownerProfile?.last_name,
    }));
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
      // Select all project fields and homeowner's first/last name from profiles
      .select('*, homeownerProfile:profiles!projects_homeownerId_fkey(first_name, last_name)')
      .eq('homeownerId', homeownerId)
      .order('updatedAt', { ascending: false });
    
    if (error) {
      console.error('Error fetching homeowner projects:', error);
      throw new Error(`Failed to fetch homeowner projects: ${error.message}`);
    }
    
    // Map the fetched data
    return (data || []).map(p => ({
      ...p,
      homeownerFirstName: p.homeownerProfile?.first_name,
      homeownerLastName: p.homeownerProfile?.last_name,
    }));
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
      // Select all project fields and homeowner's first/last name from profiles
      .select('*, homeownerProfile:profiles!projects_homeownerId_fkey(first_name, last_name)')
      .eq('builderId', builderId)
      .order('updatedAt', { ascending: false });
    
    if (error) {
      console.error('Error fetching builder projects:', error);
      throw new Error(`Failed to fetch builder projects: ${error.message}`);
    }
    
    // Map the fetched data
    return (data || []).map(p => ({
      ...p,
      homeownerFirstName: p.homeownerProfile?.first_name,
      homeownerLastName: p.homeownerProfile?.last_name,
    }));
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
      // Select all project fields and homeowner's first/last name from profiles
      .select('*, homeownerProfile:profiles!projects_homeownerId_fkey(first_name, last_name)')
      .eq('id', id)
      .single();
    
    if (error) {
      // Handle case where project is not found gracefully
      if (error.code === 'PGRST116') { 
        console.warn(`Project with ID ${id} not found.`);
        return null;
      }
      console.error('Error fetching project:', error);
      throw new Error(`Failed to fetch project: ${error.message}`);
    }
    
    // Map the fetched data if project exists
    return data ? {
      ...data,
      homeownerFirstName: data.homeownerProfile?.first_name,
      homeownerLastName: data.homeownerProfile?.last_name,
    } : null;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    throw error;
  }
}

// Create a new project
export async function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'homeownerFirstName' | 'homeownerLastName'>): Promise<Project | null> {
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
export async function updateProject(id: string, updates: Partial<Project>, currentUser?: User | null): Promise<Project | null> {
  try {
    // Check if the updates include status or progress fields
    const hasStatusOrProgressUpdates = updates.status !== undefined || updates.progress !== undefined;
    
    // If trying to update status or progress, verify the user is an admin
    if (hasStatusOrProgressUpdates && (!currentUser || currentUser.role !== 'admin')) {
      throw new Error('Only administrators can update project status or progress');
    }
    
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

// Upload project images and notify homeowner
export async function uploadProjectImages(
  projectId: string, 
  images: { url: string; caption: string; category: string }[],
  currentUser: User
): Promise<ProjectImage[]> {
  try {
    logger.info(`Uploading ${images.length} images for project ${projectId}`);
    
    // Prepare image data for insertion
    const imageData = images.map(image => ({
      projectId,
      url: image.url,
      caption: image.caption,
      category: image.category,
      createdAt: new Date().toISOString()
    }));
    
    // Insert images into the database
    const { data: uploadedImages, error } = await supabaseAdmin
      .from('project_images')
      .insert(imageData)
      .select();
    
    if (error) {
      logger.error(`Error uploading project images:`, error);
      throw new Error(`Failed to upload project images: ${error.message}`);
    }
    
    // Get the project details
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    
    if (projectError) {
      logger.error(`Error fetching project details:`, projectError);
      throw new Error(`Failed to fetch project details: ${projectError.message}`);
    }
    
    // Update the project's thumbnail if it doesn't have one
    if (!project.thumbnail && uploadedImages.length > 0) {
      await updateProjectThumbnail(projectId, uploadedImages[0].url);
    }
    
    // Update the project's updatedAt timestamp
    await supabaseAdmin
      .from('projects')
      .update({ updatedAt: new Date().toISOString() })
      .eq('id', projectId);
    
    // Send notification to homeowner if the current user is an admin
    if (currentUser.role === 'admin' && project.homeownerId) {
      try {
        // Get the homeowner details
        const homeowner = await getUserById(project.homeownerId);
        
        if (homeowner) {
          logger.info(`Sending notification to homeowner ${homeowner.email} about new photos`);
          
          // Send notification email
          await sendProjectPhotosNotification(
            homeowner,
            project,
            uploadedImages,
            currentUser.name
          );
        }
      } catch (notificationError) {
        // Don't fail the upload if notification fails
        logger.error(`Failed to send notification to homeowner:`, notificationError);
      }
    }
    
    return uploadedImages;
  } catch (error) {
    logger.error(`Error in uploadProjectImages:`, error);
    throw error;
  }
} 