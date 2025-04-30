import { createClient } from '@supabase/supabase-js';
// import { Database } from '@/types/supabase'; // Type import commented out to avoid build errors

// Use environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Ensure environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided in environment variables.");
}

// This is the regular client that respects RLS policies
// export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
export const supabase = createClient(supabaseUrl, supabaseAnonKey, { // Removed Database type annotation
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

// WARNING: Service role key operations should ONLY be done on a secure backend (e.g., Edge Functions).
// The service role key MUST NOT be exposed client-side.
// The supabaseAdmin client initialization has been removed from this file.
// Use server-side environment variables (without VITE_ prefix) for the service key in backend code. 