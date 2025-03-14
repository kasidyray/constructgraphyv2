import { supabase, supabaseAdmin } from '@/lib/supabase';
import { ProjectImage } from '@/types';
import { mockProjectImages } from '@/data/mockData';
import { updateProjectThumbnail } from './projectService';

// Valid image categories
type ImageCategory = 'other' | 'interior' | 'exterior' | 'structural' | 'finishes' | 'general';

// Get all images for a project
export async function getProjectImages(projectId: string): Promise<ProjectImage[]> {
  try {
    console.log('Fetching images for project:', projectId);
    
    const { data, error } = await supabaseAdmin
      .from('project_images')
      .select('*')
      .eq('projectId', projectId)
      .order('createdAt', { ascending: false });
    
    if (error) {
      console.error('Error fetching project images:', error);
      throw new Error(`Failed to fetch project images: ${error.message}`);
    }
    
    console.log('Retrieved images:', data?.length || 0);
    return data || [];
  } catch (err) {
    console.error('Unexpected error in getProjectImages:', err);
    throw err;
  }
}

// Upload a single image
export async function uploadProjectImage(
  projectId: string, 
  file: File, 
  category: ImageCategory = 'other'
): Promise<ProjectImage | null> {
  try {
    console.log('Uploading image for project:', projectId);
    
    // First upload the file to Supabase storage
    const fileName = `${projectId}/${Date.now()}-${file.name}`;
    const { data: fileData, error: fileError } = await supabaseAdmin.storage
      .from('project-images')
      .upload(fileName, file);
    
    if (fileError) {
      console.error('Error uploading file to storage:', fileError);
      throw new Error(`Failed to upload file to storage: ${fileError.message}`);
    }
    
    // Get the public URL for the uploaded file
    const { data: urlData } = supabaseAdmin.storage
      .from('project-images')
      .getPublicUrl(fileName);
    
    const publicUrl = urlData?.publicUrl;
    
    if (!publicUrl) {
      console.error('Failed to get public URL for uploaded file');
      throw new Error('Failed to get public URL for uploaded file');
    }
    
    // Create a record in the project_images table
    const newImage: Omit<ProjectImage, 'id' | 'createdAt'> = {
      projectId,
      url: publicUrl,
      category,
      caption: file.name.split('.')[0],
    };
    
    const { data, error } = await supabaseAdmin
      .from('project_images')
      .insert(newImage)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating image record:', error);
      throw new Error(`Failed to create image record: ${error.message}`);
    }
    
    // Check if this is the first image for the project
    const { count, error: countError } = await supabaseAdmin
      .from('project_images')
      .select('*', { count: 'exact', head: true })
      .eq('projectId', projectId);
    
    if (countError) {
      console.error('Error counting project images:', countError);
    } else if (count === 1) {
      // This is the first image, set it as the project thumbnail
      console.log('Setting first image as project thumbnail:', publicUrl);
      try {
        await updateProjectThumbnail(projectId, publicUrl);
      } catch (thumbnailError) {
        console.error('Error setting project thumbnail:', thumbnailError);
        // Continue anyway, this is not critical
      }
    }
    
    return data;
  } catch (err) {
    console.error('Unexpected error in uploadProjectImage:', err);
    throw err;
  }
}

// Upload multiple images at once
export async function uploadProjectImages(
  projectId: string, 
  files: File[], 
  category: ImageCategory = 'other'
): Promise<ProjectImage[]> {
  const results = await Promise.all(
    files.map(file => uploadProjectImage(projectId, file, category))
  );
  
  return results.filter(Boolean) as ProjectImage[];
}

// Delete a project image
export async function deleteProjectImage(imageId: string): Promise<boolean> {
  try {
    // First get the image to get the file path
    const { data: image, error: getError } = await supabaseAdmin
      .from('project_images')
      .select('url')
      .eq('id', imageId)
      .single();
    
    if (getError) {
      console.error('Error fetching image to delete:', getError);
      throw new Error(`Failed to fetch image to delete: ${getError.message}`);
    }
    
    if (!image) {
      console.error('Image not found:', imageId);
      throw new Error(`Image not found: ${imageId}`);
    }
    
    // Extract the file path from the URL
    const url = new URL(image.url);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf('project-images') + 1).join('/');
    
    // Delete the file from storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('project-images')
      .remove([filePath]);
    
    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      // Continue anyway to delete the database record
    }
    
    // Delete the record from the database
    const { error: dbError } = await supabaseAdmin
      .from('project_images')
      .delete()
      .eq('id', imageId);
    
    if (dbError) {
      console.error('Error deleting image record:', dbError);
      throw new Error(`Failed to delete image record: ${dbError.message}`);
    }
    
    return true;
  } catch (err) {
    console.error('Unexpected error in deleteProjectImage:', err);
    throw err;
  }
}

// Update a project image
export async function updateProjectImage(imageId: string, updates: Partial<ProjectImage>): Promise<ProjectImage | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('project_images')
      .update(updates)
      .eq('id', imageId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating image:', error);
      throw new Error(`Failed to update image: ${error.message}`);
    }
    
    return data;
  } catch (err) {
    console.error('Unexpected error in updateProjectImage:', err);
    throw err;
  }
} 