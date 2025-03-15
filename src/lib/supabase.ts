import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Use environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oxobdlvtrwgzxnpkbvmz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94b2JkbHZ0cndnenhucGtidm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzU4NjMsImV4cCI6MjA1NzQ1MTg2M30.QAprkWsOEvYGl_vdV6bXveuh7ZcEF1N5TZoWuGGE_ys';

// This is the regular client that respects RLS policies
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

// For development purposes, we'll create a direct client that bypasses RLS
// WARNING: In production, this should be properly secured
// You need to add VITE_SUPABASE_SERVICE_ROLE_KEY to your .env.local file
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// If service role key is available, create an admin client
export const supabaseAdmin = serviceRoleKey 
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase; // Fall back to regular client if no service role key 