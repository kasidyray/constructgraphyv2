// Debug script to test Supabase authentication directly
import { supabase } from './src/lib/supabase';

async function testLogin() {
  console.log('Starting login test...');
  
  try {
    // Test login with admin credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@example.com',
      password: 'password123',
    });
    
    console.log('Auth response:', { data, error });
    
    if (error) {
      console.error('Login failed:', error.message);
      return;
    }
    
    if (!data.session) {
      console.error('No session returned from Supabase');
      return;
    }
    
    console.log('Login successful!');
    console.log('User ID:', data.session.user.id);
    
    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.session.user.id)
      .single();
      
    if (profileError) {
      console.error('Error fetching profile:', profileError.message);
      return;
    }
    
    console.log('User profile:', profile);
    
    // Test logout
    const { error: logoutError } = await supabase.auth.signOut();
    
    if (logoutError) {
      console.error('Error signing out:', logoutError.message);
      return;
    }
    
    console.log('Logout successful!');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the test
testLogin(); 