import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function exportSqlCommands() {
  console.log('Exporting SQL commands...');
  
  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'update-schema.sql');
    const sqlCommands = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Write the SQL commands to a file
    const outputFilePath = path.join(__dirname, 'schema-update.sql');
    fs.writeFileSync(outputFilePath, sqlCommands);
    
    console.log(`SQL commands exported to ${outputFilePath}`);
    
  } catch (error) {
    console.error('Error exporting SQL commands:', error);
  }
}

// Run the export
exportSqlCommands()
  .then(() => {
    console.log('Export script completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Export script failed:', error);
    process.exit(1);
  }); 