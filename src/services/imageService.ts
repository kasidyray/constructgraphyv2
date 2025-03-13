import { supabase } from '@/lib/supabase';
import { ProjectImage } from '@/types';

// Get all images for a project
export async function getProjectImages(projectId: string): Promise<ProjectImage[]> {
  try {
    console.log('Fetching images for project:', projectId);
    
    const { data, error } = await supabase
      .from('project_images')
      .select('*')
      .eq('projectId', projectId)
      .order('createdAt', { ascending: false });
    
    if (error) {
      console.error('Error fetching project images:', error);
      return [];
    }
    
    console.log('Retrieved images:', data?.length || 0);
    
    // If no images are found in the database, try to use mock data
    if (!data || data.length === 0) {
      console.log('No images found in database, checking mock data');
      try {
        // Import mock data dynamically to avoid circular dependencies
        const { mockProjectImages } = await import('@/data/mockData');
        const mockImages = mockProjectImages.filter(img => img.projectId === projectId);
        console.log('Found mock images:', mockImages.length);
        return mockImages;
      } catch (err) {
        console.error('Error loading mock data:', err);
      }
    }
    
    return data || [];
  } catch (err) {
    console.error('Unexpected error in getProjectImages:', err);
    return [];
  }
}

// Upload a single image
export async function uploadProjectImage(projectId: string, file: File, category: string = 'other'): Promise<ProjectImage | null> {
  try {
    console.log('Uploading image for project:', projectId);
    
    // First upload the file to Supabase storage
    const fileName = `${projectId}/${Date.now()}-${file.name}`;
    const { data: fileData, error: fileError } = await supabase.storage
      .from('project-images')
      .upload(fileName, file);
    
    if (fileError) {
      console.error('Error uploading file to storage:', fileError);
      return null;
    }
    
    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('project-images')
      .getPublicUrl(fileName);
    
    if (!urlData.publicUrl) {
      console.error('Could not get public URL for uploaded file');
      return null;
    }
    
    console.log('File uploaded successfully, public URL:', urlData.publicUrl);
    
    // Create a record in the project_images table
    const newImage = {
      projectId,
      url: urlData.publicUrl,
      caption: file.name.split('.')[0], // Use filename as caption
      createdAt: new Date(),
      category,
    };
    
    const { data, error } = await supabase
      .from('project_images')
      .insert(newImage)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating image record in database:', error);
      return null;
    }
    
    console.log('Image record created successfully:', data.id);
    return data;
  } catch (error) {
    console.error('Error in uploadProjectImage:', error);
    return null;
  }
}

// Upload multiple images
export async function uploadProjectImages(projectId: string, files: File[], category: string = 'other'): Promise<ProjectImage[]> {
  const uploadPromises = files.map(file => uploadProjectImage(projectId, file, category));
  const results = await Promise.all(uploadPromises);
  
  // Filter out null results
  return results.filter((result): result is ProjectImage => result !== null);
}

// Delete an image
export async function deleteProjectImage(imageId: string): Promise<boolean> {
  try {
    // First get the image to get the file path
    const { data: image, error: getError } = await supabase
      .from('project_images')
      .select('*')
      .eq('id', imageId)
      .single();
    
    if (getError || !image) {
      console.error('Error getting image to delete:', getError);
      return false;
    }
    
    // Extract the file path from the URL
    const url = new URL(image.url);
    const filePath = url.pathname.split('/').slice(-2).join('/');
    
    // Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from('project-images')
      .remove([filePath]);
    
    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      // Continue anyway to delete the database record
    }
    
    // Delete the database record
    const { error } = await supabase
      .from('project_images')
      .delete()
      .eq('id', imageId);
    
    if (error) {
      console.error('Error deleting image record:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteProjectImage:', error);
    return false;
  }
}

// Update image details (caption, category)
export async function updateProjectImage(imageId: string, updates: Partial<ProjectImage>): Promise<ProjectImage | null> {
  const { data, error } = await supabase
    .from('project_images')
    .update(updates)
    .eq('id', imageId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating image:', error);
    return null;
  }
  
  return data;
} 