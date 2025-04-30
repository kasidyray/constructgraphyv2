// This script creates Supabase Auth users for existing users in the database
// Run this script with Node.js to create the auth users

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
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
// Implement a secure way to set initial passwords (e.g., prompt, random generation + reset flow).
// const DEFAULT_PASSWORD = 'YOUR_SECURE_DEFAULT_PASSWORD_OR_METHOD';

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
        try {
          console.log(`Creating auth user for ${user.email} (ID: ${user.id})`);
          const { data: authUser, error: createAuthError } = await supabase.auth.admin.createUser({
            user_id: user.id, // Link auth user to existing user ID
            email: user.email,
            // password: DEFAULT_PASSWORD, // REMOVED - Handle password securely
            email_confirm: true, // Mark email as confirmed
            user_metadata: {
              first_name: user.first_name,
              last_name: user.last_name,
              role: user.role,
            },
          });

          if (createAuthError) {
            // Log specific error for this user but continue if possible
            console.error(`Error creating auth user for ${user.email}:`, createAuthError.message);
          } else {
            console.log(`Successfully created auth user for ${user.email}`);
          }
        } catch (processError) {
          console.error(`Unexpected error processing user ${user.email}:`, processError);
        }
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