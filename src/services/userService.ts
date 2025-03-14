import { supabase, supabaseAdmin } from '@/lib/supabase';
import { User } from '@/types';
import { mockUsers } from '@/data/mockData';

// Get all users
export async function getUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
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
        .from('users')
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
      .from('users')
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
  const newUser = {
    ...user,
    email: user.email.toLowerCase(),
    createdAt: new Date(),
  };
  
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(newUser)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user in Supabase:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    throw error;
  }
}

// Update a user
export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
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