// This script creates Supabase Auth users for existing users in the database
// Run this script with Node.js to create the auth users

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

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

async function createAuthUsers() {
  try {
    // Get all users from the database
    const { data: users, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      throw error;
    }

    console.log(`Found ${users.length} users in the database.`);

    // Create auth users for each user in the database
    for (const user of users) {
      try {
        // Check if user already exists in auth.users
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers({
          filters: {
            email: user.email
          }
        });

        if (authError) {
          throw authError;
        }

        if (authUsers.users.length > 0) {
          console.log(`User ${user.email} already exists in auth.users. Skipping...`);
          continue;
        }

        // Create auth user with the same ID as the database user
        const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
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
          throw createError;
        }

        console.log(`Created auth user for ${user.email} with ID ${authUser.user.id}`);
      } catch (userError) {
        console.error(`Error creating auth user for ${user.email}:`, userError);
      }
    }

    console.log('Finished creating auth users.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
createAuthUsers(); 