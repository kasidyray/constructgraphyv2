import { supabase, supabaseAdmin } from '@/lib/supabase';
import { User } from '@/types';
import { mockUsers } from '@/data/mockData';
import { v4 as uuidv4 } from 'uuid';
import { sendWelcomeEmail } from './emailService';
import logger from '@/utils/logger';

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

// Create a new user using Supabase invite
export async function createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User | null> {
  logger.info(`Attempting to invite user: ${user.email}`);
  try {
    // Prepare user metadata for the invite
    let firstName = null;
    let lastName = null;
    
    // Only attempt to split name for homeowners and admins
    if ((user.role === 'homeowner' || user.role === 'admin') && user.name && user.name.includes(' ')) {
      firstName = user.name.split(' ')[0];
      lastName = user.name.split(' ').slice(1).join(' ');
    }

    const userMetadata = {
      name: user.name, // Full name (or builder name)
      role: user.role,
      phone: user.phone,
      // Conditionally include first/last name ONLY for homeowner/admin roles
      // and if the split was successful
      ...(firstName && (user.role === 'homeowner' || user.role === 'admin') && { first_name: firstName }),
      ...(lastName && (user.role === 'homeowner' || user.role === 'admin') && { last_name: lastName }),
      // Add builderId if provided (typically null/undefined for invite)
      ...(user.builderId && { builderId: user.builderId })
    };

    logger.info(`Inviting user with metadata: ${JSON.stringify(userMetadata)}`);

    // Step 1: Invite the user using Supabase Auth Admin API
    const { data: invitedUserResponse, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      user.email.toLowerCase(),
      {
        data: userMetadata, // Pass refined metadata
        redirectTo: `${window.location.origin}/reset-password` 
      }
    );

    if (inviteError) {
      logger.error('Error inviting user:', inviteError);
      // Handle specific errors like user already exists
      if (inviteError.message.includes('User already exists')) {
        throw new Error(`User with email ${user.email} already exists.`);
      } else if (inviteError.message.includes('rate limit')) {
         throw new Error('Rate limit exceeded for sending invites. Please try again later.');
      }
      throw new Error(`Failed to invite user: ${inviteError.message}`);
    }

    if (!invitedUserResponse || !invitedUserResponse.user) {
        logger.error('Invite response did not contain user data.');
        throw new Error('Failed to invite user: Invalid response from server.');
    }

    const userId = invitedUserResponse.user.id;
    logger.info(`User invite sent successfully for ID: ${userId}`);

    // Step 2: Wait a moment for the trigger to potentially create the profile
    // (The trigger associated with auth.users should handle profile creation)
    await new Promise(resolve => setTimeout(resolve, 1000)); // Increased wait slightly

    // Step 3: Fetch the profile to return the complete User object
    // This also confirms the trigger worked or allows fallback update
    const { data: existingProfile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError && !fetchError.message.includes('No rows found')) {
      logger.error('Error fetching profile after invite:', fetchError);
      // Don't fail here, but log the issue. The user exists in auth.
    }

    if (existingProfile) {
      logger.info(`Profile found for invited user ${userId}. Checking if update needed.`);
      // Optional: Check if profile needs update based on metadata vs fetched data
      // This logic can be simplified if trigger reliably uses all metadata
      const updatesNeeded: Partial<User> = {};
      if (existingProfile.name !== userMetadata.name) updatesNeeded.name = userMetadata.name;
      if (existingProfile.role !== userMetadata.role) updatesNeeded.role = userMetadata.role;
      if (existingProfile.phone !== userMetadata.phone) updatesNeeded.phone = userMetadata.phone;
      if (userMetadata.first_name && existingProfile.first_name !== userMetadata.first_name) updatesNeeded.first_name = userMetadata.first_name;
      if (userMetadata.last_name && existingProfile.last_name !== userMetadata.last_name) updatesNeeded.last_name = userMetadata.last_name;
      
      if (Object.keys(updatesNeeded).length > 0) {
         logger.info(`Updating profile for ${userId} with keys: ${Object.keys(updatesNeeded).join(', ')}`);
         const { data: updatedProfile, error: updateError } = await supabaseAdmin
           .from('profiles')
           .update(updatesNeeded)
           .eq('id', userId)
           .select()
           .single();
         if (updateError) {
            logger.error('Error updating profile after invite:', updateError);
            // Don't fail user creation, return potentially incomplete profile
            return existingProfile;
         }  
         return updatedProfile; 
      } else {
          logger.info(`Profile for ${userId} is already up-to-date.`);
          return existingProfile; // Return existing, up-to-date profile
      }
    } else {
      // Profile doesn't exist - Trigger likely failed or hasn't run yet.
      // This is less ideal, maybe log a more severe warning.
      logger.warn(`Profile not found for invited user ${userId}. Trigger might have failed.`);
      // Return a basic user object based on invite data
      return {
          id: userId,
          email: user.email.toLowerCase(),
          name: userMetadata.name || '',
          role: userMetadata.role,
          phone: userMetadata.phone,
          first_name: userMetadata.first_name,
          last_name: userMetadata.last_name,
          createdAt: invitedUserResponse.user.created_at || new Date().toISOString(),
          // Indicate profile might be incomplete
      } as User;
    }

    // Remove the explicit sendWelcomeEmail call
    /*
    try {
      logger.info(`Sending welcome email to new user: ${user.email}`);
      await sendWelcomeEmail({
        id: userId,
        email: user.email.toLowerCase(),
        name: user.name,
        role: user.role,
        createdAt: new Date().toISOString()
      });
    } catch (emailError) {
      logger.error(`Failed to send welcome email to ${user.email}:`, emailError);
    }
    */
   
    // Return profileData; // This line is now handled within the if/else block above
  } catch (error) {
    logger.error('Error in createUser (invite flow):', error);
    // Re-throw the error so the frontend can display it
    throw error;
  }
}

// Update user profile data
export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  // Ensure we don't try to update the ID or role inappropriately
  // Role updates should likely be handled by a separate admin function
  const { id, role, email_confirmed_at, last_sign_in_at, projects, builderName, ...validUpdates } = updates;

  // Prevent email updates for now, as it might require re-verification
  if (validUpdates.email) {
    console.warn("Email updates are not allowed through this function.");
    delete validUpdates.email;
  }

  // Prevent updating createdAt
  if ('createdAt' in validUpdates) {
    delete (validUpdates as Partial<User>).createdAt;
  }
  
  // Remove fields that don't exist directly on the profiles table
  // (No extra fields from Project type here)

  if (Object.keys(validUpdates).length === 0) {
    console.warn("No valid fields provided for update.");
    // Optionally return the existing user data or null/error
    return getUserById(userId); // Return existing data if no valid updates
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(validUpdates) // Pass only the allowed updates
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile in Supabase:', error);
      throw new Error(`Failed to update user profile: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error connecting to Supabase for user update:', error);
    throw error;
  }
}

// Delete a user and their associated data
export async function deleteUser(userId: string): Promise<boolean> {
  logger.info(`Attempting to delete user with ID: ${userId}`);
  try {
    // Ensure we are using the admin client with service_role key
    if (supabaseAdmin === supabase) {
       throw new Error("Admin privileges required: Service role key not configured.");
    }

    // Step 1: Delete associated projects (handle with care - this is destructive)
    // Delete projects where the user is the homeowner
    const { error: deleteHomeownerProjectsError } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('homeownerId', userId);

    if (deleteHomeownerProjectsError) {
      logger.error(`Error deleting projects where user ${userId} is homeowner:`, deleteHomeownerProjectsError);
      throw new Error(`Failed to delete associated homeowner projects: ${deleteHomeownerProjectsError.message}`);
    }
    logger.info(`Deleted projects where user ${userId} was homeowner.`);

    // Delete projects where the user is the builder
    const { error: deleteBuilderProjectsError } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('builderId', userId);

    if (deleteBuilderProjectsError) {
      logger.error(`Error deleting projects where user ${userId} is builder:`, deleteBuilderProjectsError);
      throw new Error(`Failed to delete associated builder projects: ${deleteBuilderProjectsError.message}`);
    }
    logger.info(`Deleted projects where user ${userId} was builder.`);
    
    // Step 2: Delete the user's profile from public.profiles
    const { error: deleteProfileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    // Ignore error if profile simply doesn't exist (e.g., inconsistent data)
    if (deleteProfileError && !deleteProfileError.message.includes('No rows found')) {
      logger.error(`Error deleting profile for user ${userId}:`, deleteProfileError);
      throw new Error(`Failed to delete user profile: ${deleteProfileError.message}`);
    }
    logger.info(`Deleted profile for user ${userId}.`);

    // Step 3: Delete the user from auth.users
    const { data: deletionResult, error: deleteAuthUserError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteAuthUserError) {
      logger.error(`Error deleting auth user ${userId}:`, deleteAuthUserError);
      // Handle potential specific errors, e.g., user not found (might have been deleted already)
       if (deleteAuthUserError.message.includes('User not found')) {
          logger.warn(`Auth user ${userId} not found, possibly already deleted.`);
          // Consider returning true as the end state (user doesn't exist) is achieved
          return true; 
       }
      throw new Error(`Failed to delete auth user: ${deleteAuthUserError.message}`);
    }

    logger.info(`Successfully deleted auth user ${userId}.`);
    return true;

  } catch (error) {
    logger.error(`Error in deleteUser function for user ${userId}:`, error);
    // Re-throw the error for the frontend to catch
    throw error;
  }
} 