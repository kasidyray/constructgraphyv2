import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oxobdlvtrwgzxnpkbvmz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94b2JkbHZ0cndnenhucGtidm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzU4NjMsImV4cCI6MjA1NzQ1MTg2M30.QAprkWsOEvYGl_vdV6bXveuh7ZcEF1N5TZoWuGGE_ys';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 