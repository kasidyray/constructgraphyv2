import { supabase } from '@/lib/supabase';

interface FavoriteImage {
  id: string;
  userId: string;
  imageId: string;
  projectId: string;
  createdAt: string;
}

// Get all favorite images for a user
export async function getUserFavorites(userId: string): Promise<string[]> {
  try {
    console.log('Fetching favorites for user:', userId);
    
    const { data, error } = await supabase
      .from('user_favorites')
      .select('imageId')
      .eq('userId', userId);
    
    if (error) {
      console.error('Error fetching user favorites:', error);
      return [];
    }
    
    console.log('Retrieved favorites:', data?.length || 0);
    return data?.map(fav => fav.imageId) || [];
  } catch (err) {
    console.error('Unexpected error in getUserFavorites:', err);
    return [];
  }
}

// Get all favorite images for a user in a specific project
export async function getUserProjectFavorites(userId: string, projectId: string): Promise<string[]> {
  try {
    console.log('Fetching favorites for user:', userId, 'in project:', projectId);
    
    const { data, error } = await supabase
      .from('user_favorites')
      .select('imageId')
      .eq('userId', userId)
      .eq('projectId', projectId);
    
    if (error) {
      console.error('Error fetching user project favorites:', error);
      return [];
    }
    
    console.log('Retrieved project favorites:', data?.length || 0);
    return data?.map(fav => fav.imageId) || [];
  } catch (err) {
    console.error('Unexpected error in getUserProjectFavorites:', err);
    return [];
  }
}

// Add an image to favorites
export async function addToFavorites(userId: string, imageId: string, projectId: string): Promise<boolean> {
  try {
    console.log('Adding image to favorites:', imageId, 'for user:', userId);
    
    // Check if already favorited
    const { data: existing, error: checkError } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('userId', userId)
      .eq('imageId', imageId)
      .single();
    
    if (existing) {
      console.log('Image already in favorites');
      return true; // Already favorited
    }
    
    const { error } = await supabase
      .from('user_favorites')
      .insert({
        userId,
        imageId,
        projectId,
        createdAt: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
    
    console.log('Image added to favorites successfully');
    return true;
  } catch (err) {
    console.error('Unexpected error in addToFavorites:', err);
    return false;
  }
}

// Remove an image from favorites
export async function removeFromFavorites(userId: string, imageId: string): Promise<boolean> {
  try {
    console.log('Removing image from favorites:', imageId, 'for user:', userId);
    
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('userId', userId)
      .eq('imageId', imageId);
    
    if (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
    
    console.log('Image removed from favorites successfully');
    return true;
  } catch (err) {
    console.error('Unexpected error in removeFromFavorites:', err);
    return false;
  }
} 