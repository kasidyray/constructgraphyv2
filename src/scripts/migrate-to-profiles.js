// This script migrates users from the users table to the profiles table
// and ensures all users have corresponding auth users

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: join(dirname(__dirname), '../.env.local') });

// Initialize Supabase client with admin privileges
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or service role key');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function migrateToProfiles() {
  console.log('Starting migration to profiles...');
  
  try {
    // 1. Get all users from public.users
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*');
    
    if (usersError) {
      throw new Error(`Failed to fetch users: ${usersError.message}`);
    }
    
    console.log(`Found ${users.length} users to migrate`);
    
    // 2. For each user, create an auth user if it doesn't exist
    for (const user of users) {
      console.log(`Processing user: ${user.email}`);
      
      // Check if user already exists in auth.users
      const { data: authUser, error: authUserError } = await supabaseAdmin.auth.admin.getUserById(user.id);
      
      if (authUserError && !authUserError.message.includes('User not found')) {
        console.error(`Error checking auth user: ${authUserError.message}`);
        continue;
      }
      
      if (!authUser) {
        // Create user in auth.users
        console.log(`Creating auth user for: ${user.email}`);
        const { data: newAuthUser, error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: 'Temp123!', // Temporary password
          email_confirm: true,
          user_metadata: {
            name: user.name,
            role: user.role
          }
        });
        
        if (createAuthError) {
          console.error(`Failed to create auth user: ${createAuthError.message}`);
          continue;
        }
        
        console.log(`Created auth user with ID: ${newAuthUser.user.id}`);
      }
    }
    
    // 3. Check if profiles exist for each user, create if not
    for (const user of users) {
      // Check if profile exists
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError && !profileError.message.includes('No rows found')) {
        console.error(`Error checking profile: ${profileError.message}`);
        continue;
      }
      
      if (!profile) {
        // Create profile
        console.log(`Creating profile for: ${user.email}`);
        const { error: createProfileError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
            avatar: user.avatar,
            builderId: user.builderId,
            createdAt: user.createdAt || new Date().toISOString()
          });
        
        if (createProfileError) {
          console.error(`Failed to create profile: ${createProfileError.message}`);
          continue;
        }
        
        console.log(`Created profile for: ${user.email}`);
      } else {
        console.log(`Profile already exists for: ${user.email}`);
      }
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateToProfiles()
  .then(() => {
    console.log('Migration script completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Migration script failed:', error);
    process.exit(1);
  }); 