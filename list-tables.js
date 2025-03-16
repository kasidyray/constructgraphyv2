// Script to list all tables in the Supabase database and their contents
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL or service role key not found in environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// List of tables to export
const tables = [
  'projects',
  'project_images',
  'users',
  // Add any other tables you want to export
];

async function exportTableData() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputDir = path.join(process.cwd(), 'db_snapshots');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputFile = path.join(outputDir, `db_snapshot_${timestamp}.json`);
  const result = {};
  
  console.log('Exporting database tables...');
  
  for (const table of tables) {
    try {
      console.log(`Fetching data from ${table}...`);
      const { data, error } = await supabase
        .from(table)
        .select('*');
      
      if (error) {
        console.error(`Error fetching data from ${table}:`, error);
        result[table] = { error: error.message };
      } else {
        console.log(`Retrieved ${data.length} rows from ${table}`);
        result[table] = data;
      }
    } catch (err) {
      console.error(`Unexpected error with table ${table}:`, err);
      result[table] = { error: err.message };
    }
  }
  
  // Write the result to a file
  fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
  console.log(`Database snapshot saved to ${outputFile}`);
}

// Run the export function
exportTableData().catch(err => {
  console.error('Error exporting database:', err);
  process.exit(1);
}); 