import { supabase, supabaseAdmin } from '@/lib/supabase';
import { User } from '@/types';
import { mockUsers } from '@/data/mockData';
import { v4 as uuidv4 } from 'uuid';

// Get all users
export async function getUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*');
    
    if (error) {
      console.error('Error fetching users:', error);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    throw error;
  }
}

// Get a user by ID
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    // Basic UUID validation (checking format)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id) && !id.startsWith('admin') && !id.startsWith('builder') && !id.startsWith('homeowner')) {
      console.error('Invalid ID format:', id);
      return null;
    }
    
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching user from Supabase:', error);
        throw new Error(`Failed to fetch user: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Error connecting to Supabase:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in getUserById:', error);
    return null;
  }
};

// Get a user by email (for mock login)
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    
    if (error) {
      console.error('Error fetching user by email from Supabase:', error);
      throw new Error(`Failed to fetch user by email: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    throw error;
  }
}

// Create a new user
export async function createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User | null> {
  try {
    // Step 1: Create a user in auth.users using Supabase Auth API
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: user.email.toLowerCase(),
      password: 'Temp123!', // Temporary password that will be changed on first login
      email_confirm: true, // Auto-confirm email to simplify the process
      user_metadata: {
        name: user.name,
        role: user.role
      }
    });
    
    if (authError) {
      console.error('Error creating auth user:', authError);
      throw new Error(`Failed to create auth user: ${authError.message}`);
    }
    
    const userId = authUser.user.id;
    
    // Step 2: Wait a moment for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Step 3: Check if profile exists (it should be created by the trigger)
    const { data: existingProfile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (fetchError && !fetchError.message.includes('No rows found')) {
      console.error('Error fetching profile:', fetchError);
      throw new Error(`Failed to fetch profile: ${fetchError.message}`);
    }
    
    if (existingProfile) {
      // Profile exists, update it with additional information
      const { data: updatedProfile, error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          name: user.name,
          role: user.role,
          phone: user.phone,
          ...(user.builderId && { builderId: user.builderId })
        })
        .eq('id', userId)
        .select()
        .single();
        
      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw new Error(`Failed to update profile: ${updateError.message}`);
      }
      
      return updatedProfile;
    } else {
      // Profile doesn't exist (unlikely, but handle it anyway)
      const newProfile = {
        id: userId,
        email: user.email.toLowerCase(),
        name: user.name,
        role: user.role,
        phone: user.phone,
        createdAt: new Date().toISOString(),
        ...(user.builderId && { builderId: user.builderId })
      };
      
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();
      
      if (profileError) {
        console.error('Error creating profile:', profileError);
        throw new Error(`Failed to create profile: ${profileError.message}`);
      }
      
      return profileData;
    }
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error;
  }
}

// Update a user
export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user in Supabase:', error);
      throw new Error(`Failed to update user: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    throw error;
  }
} 