// This script migrates users from the users table to the profiles table
// and ensures all users have corresponding auth users

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

// Default password for all users
const DEFAULT_PASSWORD = 'password123';

async function migrateToProfiles() {
  try {
    // Get all users from the users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');

    if (usersError) {
      throw usersError;
    }

    console.log(`Found ${users.length} users in the users table.`);

    // Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) {
      throw profilesError;
    }

    console.log(`Found ${profiles.length} profiles in the profiles table.`);

    // Create a map of email to profile for quick lookup
    const profilesByEmail = new Map();
    profiles.forEach(profile => {
      profilesByEmail.set(profile.email, profile);
    });

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
        // Check if user already exists in profiles
        const existingProfile = profilesByEmail.get(user.email);
        
        if (existingProfile) {
          console.log(`Profile already exists for ${user.email}. Skipping...`);
          continue;
        }

        // Check if user exists in auth.users
        const existingAuthUser = authUsersByEmail.get(user.email);
        let authUserId = user.id;
        
        if (existingAuthUser) {
          console.log(`Auth user exists for ${user.email} with ID ${existingAuthUser.id}`);
          authUserId = existingAuthUser.id;
        } else {
          // Create a new auth user with the same ID as the user in the users table
          console.log(`Creating auth user for ${user.email} with ID ${user.id}...`);
          
          const { data: newAuthUser, error: createError } = await supabase.auth.admin.createUser({
            email: user.email,
            password: DEFAULT_PASSWORD,
            email_confirm: true,
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
          authUserId = newAuthUser.user.id;
        }
        
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
      } catch (userError) {
        console.error(`Error processing user ${user.email}:`, userError);
      }
    }

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
migrateToProfiles(); 