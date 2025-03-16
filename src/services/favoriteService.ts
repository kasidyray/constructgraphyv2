import { supabase, supabaseAdmin } from '@/lib/supabase';
import { mockUserFavorites } from '@/data/mockData';

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
    
    // Use admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('user_favourites')
      .select('imageId')
      .eq('userId', userId);
    
    if (error) {
      console.error('Error fetching user favorites:', error);
      console.log('Falling back to mock data for user favorites');
      
      // Check if mockUserFavorites exists and has data for this user
      const mockFavorites = mockUserFavorites?.filter(fav => fav.userId === userId) || [];
      return mockFavorites.map(fav => fav.imageId);
    }
    
    console.log('Retrieved favorites:', data?.length || 0);
    return data?.map(fav => fav.imageId) || [];
  } catch (err) {
    console.error('Unexpected error in getUserFavorites:', err);
    console.log('Falling back to mock data for user favorites due to error');
    
    // Check if mockUserFavorites exists and has data for this user
    const mockFavorites = mockUserFavorites?.filter(fav => fav.userId === userId) || [];
    return mockFavorites.map(fav => fav.imageId);
  }
}

// Get all favorite images for a user in a specific project
export async function getUserProjectFavorites(userId: string, projectId: string): Promise<string[]> {
  try {
    console.log('Fetching favorites for user:', userId, 'in project:', projectId);
    
    // Use admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('user_favourites')
      .select('imageId')
      .eq('userId', userId)
      .eq('projectId', projectId);
    
    if (error) {
      console.error('Error fetching user project favorites:', error);
      console.log('Falling back to mock data for user project favorites');
      
      // Check if mockUserFavorites exists and has data for this user and project
      const mockFavorites = mockUserFavorites?.filter(
        fav => fav.userId === userId && fav.projectId === projectId
      ) || [];
      return mockFavorites.map(fav => fav.imageId);
    }
    
    return data?.map(fav => fav.imageId) || [];
  } catch (err) {
    console.error('Unexpected error in getUserProjectFavorites:', err);
    console.log('Falling back to mock data for user project favorites due to error');
    
    // Check if mockUserFavorites exists and has data for this user and project
    const mockFavorites = mockUserFavorites?.filter(
      fav => fav.userId === userId && fav.projectId === projectId
    ) || [];
    return mockFavorites.map(fav => fav.imageId);
  }
}

// Add an image to favorites
export async function addToFavorites(userId: string, imageId: string, projectId: string): Promise<boolean> {
  try {
    // Check if already favorited
    const { data: existing, error: checkError } = await supabase
      .from('user_favourites')
      .select('id')
      .eq('userId', userId)
      .eq('imageId', imageId)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking existing favorite:', checkError);
      return false;
    }
    
    // If already favorited, return success
    if (existing) {
      console.log('Image already in favorites');
      return true;
    }
    
    // Add to favorites
    const { error } = await supabase
      .from('user_favourites')
      .insert({
        userId,
        imageId,
        projectId,
        createdAt: new Date().toISOString(),
      });
    
    if (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
    
    console.log('Added to favorites successfully');
    return true;
  } catch (err) {
    console.error('Unexpected error in addToFavorites:', err);
    return false;
  }
}

// Remove an image from favorites
export async function removeFromFavorites(userId: string, imageId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_favourites')
      .delete()
      .eq('userId', userId)
      .eq('imageId', imageId);
    
    if (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
    
    console.log('Removed from favorites successfully');
    return true;
  } catch (err) {
    console.error('Unexpected error in removeFromFavorites:', err);
    return false;
  }
} 