import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oxobdlvtrwgzxnpkbvmz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94b2JkbHZ0cndnenhucGtidm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzU4NjMsImV4cCI6MjA1NzQ1MTg2M30.QAprkWsOEvYGl_vdV6bXveuh7ZcEF1N5TZoWuGGE_ys';

// This is the regular client that respects RLS policies
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create a service role client that bypasses RLS
// Note: In production, you should use environment variables for the service role key
// and implement proper server-side validation
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94b2JkbHZ0cndnenhucGtidm16Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTg3NTg2MywiZXhwIjoyMDU3NDUxODYzfQ.Oi-qn7PU9U_kMEJgkRHJvTWH_MwZdW54Q-zoCCJ4HHs';

// IMPORTANT: This client bypasses RLS and should only be used for operations
// that require elevated privileges. Use with caution!
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}); 