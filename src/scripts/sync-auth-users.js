// This script syncs Supabase Auth users with the users table
// It ensures that each user in the users table has a corresponding auth user
// and updates the profiles table to match the users table

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Supabase URL or service role key not found in environment variables.');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Default password removed for security.
// Implement a secure way to set initial passwords if needed (e.g., prompt, random generation + reset flow).
// const DEFAULT_PASSWORD = 'YOUR_SECURE_DEFAULT_PASSWORD_OR_METHOD';

async function syncAuthUsers() {
  try {
    // Get all users from the users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');

    if (usersError) {
      throw usersError;
    }

    console.log(`Found ${users.length} users in the users table.`);

    // Get all auth users
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      throw authError;
    }
    
    const authUsers = authData.users;
    console.log(`Found ${authUsers.length} users in auth.users.`);
    
    // Create a map of email to auth user for quick lookup
    const authUsersByEmail = new Map();
    authUsers.forEach(user => {
      authUsersByEmail.set(user.email, user);
    });

    // Process each user in the users table
    for (const user of users) {
      try {
        const existingAuthUser = authUsersByEmail.get(user.email);
        
        if (existingAuthUser) {
          console.log(`Auth user exists for ${user.email} with ID ${existingAuthUser.id}`);
          
          // If the IDs don't match, we need to update the user record in the users table
          if (existingAuthUser.id !== user.id) {
            console.log(`ID mismatch: Auth user ID ${existingAuthUser.id} != User ID ${user.id}`);
            console.log(`Updating user ID in users table to match auth user ID...`);
            
            // Update the user ID in the users table to match the auth user ID
            const { error: updateError } = await supabase
              .from('users')
              .update({ id: existingAuthUser.id })
              .eq('id', user.id);
              
            if (updateError) {
              console.error(`Error updating user ID for ${user.email}:`, updateError);
              continue;
            }
            
            console.log(`Updated user ID for ${user.email} to ${existingAuthUser.id}`);
          }
        } else {
          // If auth user doesn't exist, create one
          console.log(`Auth user for ${user.email} (ID: ${user.id}) not found. Creating...`);
          try {
            const { data: newAuthUser, error: createError } = await supabase.auth.admin.createUser({
              user_id: user.id, // Use the existing database ID
              email: user.email,
              // password: DEFAULT_PASSWORD, // REMOVED - Handle password securely
              email_confirm: true, // Assume email is confirmed if user exists in DB
              user_metadata: {
                name: user.name,
                role: user.role
              },
              app_metadata: {
                role: user.role
              },
              id: user.id
            });
            
            if (createError) {
              console.error(`Error creating auth user for ${user.email}:`, createError);
              continue;
            }
            
            console.log(`Created auth user for ${user.email} with ID ${newAuthUser.user.id}`);
          } catch (createError) {
            console.error(`Error creating auth user for ${user.email}:`, createError);
            continue;
          }
        }
        
        // Ensure the profiles table has the correct data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();
          
        if (profileError) {
          console.error(`Error checking profile for ${user.email}:`, profileError);
          continue;
        }
        
        const authUserId = authUsersByEmail.get(user.email)?.id || user.id;
        
        if (!profileData) {
          // Create a new profile
          console.log(`Creating profile for ${user.email}...`);
          
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: authUserId,
              email: user.email,
              name: user.name,
              role: user.role,
              avatar: user.avatar,
              phone: user.phone,
              builderId: user.builderId,
              createdAt: user.createdAt
            });
            
          if (insertError) {
            console.error(`Error creating profile for ${user.email}:`, insertError);
          } else {
            console.log(`Created profile for ${user.email}`);
          }
        } else {
          // Update the existing profile
          console.log(`Updating profile for ${user.email}...`);
          
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              name: user.name,
              role: user.role,
              avatar: user.avatar,
              phone: user.phone,
              builderId: user.builderId
            })
            .eq('id', authUserId);
            
          if (updateError) {
            console.error(`Error updating profile for ${user.email}:`, updateError);
          } else {
            console.log(`Updated profile for ${user.email}`);
          }
        }
      } catch (userError) {
        console.error(`Error processing user ${user.email}:`, userError);
      }
    }

    console.log('Finished syncing auth users.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
syncAuthUsers(); 