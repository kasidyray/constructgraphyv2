import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
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

async function updateSchema() {
  console.log('Starting database schema update...');
  
  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'update-schema.sql');
    const sqlCommands = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL commands by semicolon
    const commands = sqlCommands
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0);
    
    console.log(`Found ${commands.length} SQL commands to execute`);
    
    // Execute each command
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      console.log(`Executing command ${i + 1}/${commands.length}...`);
      
      const { error } = await supabaseAdmin.rpc('exec_sql', { sql_query: command });
      
      if (error) {
        console.error(`Error executing command ${i + 1}:`, error);
        console.error('Command:', command);
      } else {
        console.log(`Command ${i + 1} executed successfully`);
      }
    }
    
    console.log('Database schema update completed successfully!');
    
  } catch (error) {
    console.error('Database schema update failed:', error);
  }
}

// Run the update
updateSchema()
  .then(() => {
    console.log('Update script completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Update script failed:', error);
    process.exit(1);
  }); 